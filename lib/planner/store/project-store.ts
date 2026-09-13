"use client";

import { create } from "zustand";
import type {
  AddOnType,
  ArchitectureStyle,
  CostTier,
  FixtureType,
  FixtureVariant,
  Opening,
  Placement,
  Project,
  RoomPreset,
  Unit,
} from "@/lib/planner/types";
import { DIM_BOUNDS } from "@/lib/planner/defaults";
import { getProjectStore } from "@/lib/planner/db";
import { generateLayout } from "@/lib/planner/layout/engine";
import { generateEstimate as computeEstimate } from "@/lib/planner/estimate/engine";

type DimKey = keyof typeof DIM_BOUNDS;

interface ProjectState {
  project: Project | null;
  loading: boolean;
  /** Display unit preference (session-level; not part of the saved project). */
  unit: Unit;
  setUnit: (unit: Unit) => void;

  /** Load the user's most recent project, or create a fresh default one. */
  loadOrCreate: (userId: string) => Promise<void>;
  hydrate: (project: Project) => void;

  // Step 1 — room
  setRoomName: (name: string) => void;
  setPreset: (preset: RoomPreset, name: string) => void;
  adjustDim: (dim: DimKey, delta: number) => void;
  resetDims: () => void;
  setDoor: (opening: Opening) => void;
  setWindow: (opening: Opening | null) => void;
  setFixturePlacement: (type: FixtureType, placement: Placement) => void;

  // Step 3 — fixture specs & add-ons
  setFixtureVariant: (type: FixtureType, variant: FixtureVariant) => void;
  toggleAddOn: (addOn: AddOnType) => void;

  // Step 2 — style & budget
  setArchitecture: (style: ArchitectureStyle) => void;
  setCostTier: (tier: CostTier) => void;
  setBudget: (inr: number) => void;

  // Step 4 — generate the 2D plan from current inputs
  generatePlan: () => void;

  // Step 5 — generate the material + cost estimate
  generateEstimate: () => void;

  // Step 6 — mark the project saved/finalised
  finalize: () => void;
}

function clampDim(dim: DimKey, value: number): number {
  const { min, max } = DIM_BOUNDS[dim];
  return Math.max(min, Math.min(max, value));
}

function dimField(dim: DimKey): "lengthInches" | "widthInches" | "heightInches" {
  return dim === "length" ? "lengthInches" : dim === "width" ? "widthInches" : "heightInches";
}

export const useProjectStore = create<ProjectState>((set, get) => {
  /** Apply a mutation to the current project, bump updatedAt, persist. */
  function mutate(fn: (p: Project) => Project) {
    const current = get().project;
    if (!current) return;
    const next = { ...fn(current), updatedAt: new Date().toISOString() };
    set({ project: next });
    // write-through (fire and forget); the data seam handles persistence.
    void getProjectStore().update(next.id, next).catch(() => {});
  }

  return {
    project: null,
    loading: false,
    unit: "imperial",

    setUnit(unit) {
      set({ unit });
    },

    async loadOrCreate(userId: string) {
      set({ loading: true });
      const store = getProjectStore();
      const existing = await store.list(userId);
      const project =
        existing.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ??
        (await store.create({ ownerId: userId, name: "Master Ensuite" }));
      set({ project, loading: false });
    },

    hydrate(project) {
      set({ project });
    },

    setRoomName(name) {
      mutate((p) => ({ ...p, room: { ...p.room, name, preset: null } }));
    },

    setPreset(preset, name) {
      mutate((p) => ({ ...p, room: { ...p.room, preset, name } }));
    },

    adjustDim(dim, delta) {
      mutate((p) => {
        const field = dimField(dim);
        return {
          ...p,
          room: { ...p.room, [field]: clampDim(dim, p.room[field] + delta) },
        };
      });
    },

    resetDims() {
      mutate((p) => ({
        ...p,
        room: { ...p.room, lengthInches: 102, widthInches: 72, heightInches: 108 },
      }));
    },

    setDoor(opening) {
      mutate((p) => ({ ...p, room: { ...p.room, door: opening } }));
    },

    setWindow(opening) {
      mutate((p) => ({ ...p, room: { ...p.room, window: opening } }));
    },

    setFixturePlacement(type, placement) {
      mutate((p) => ({
        ...p,
        fixtures: p.fixtures.map((f) => (f.type === type ? { ...f, placement } : f)),
      }));
    },

    setFixtureVariant(type, variant) {
      mutate((p) => ({
        ...p,
        fixtures: p.fixtures.map((f) => (f.type === type ? { ...f, variant } : f)),
      }));
    },

    toggleAddOn(addOn) {
      mutate((p) => ({
        ...p,
        addOns: p.addOns.includes(addOn)
          ? p.addOns.filter((a) => a !== addOn)
          : [...p.addOns, addOn],
      }));
    },

    setArchitecture(style) {
      mutate((p) => ({ ...p, style: { ...p.style, architecture: style } }));
    },

    setCostTier(tier) {
      mutate((p) => ({ ...p, style: { ...p.style, costTier: tier } }));
    },

    setBudget(inr) {
      mutate((p) => ({ ...p, style: { ...p.style, budgetInr: inr } }));
    },

    generatePlan() {
      mutate((p) => ({
        ...p,
        plan: generateLayout(p.room, p.fixtures),
        status: p.status === "draft" ? "planned" : p.status,
      }));
    },

    generateEstimate() {
      mutate((p) => ({
        ...p,
        estimate: computeEstimate(p.room, p.style, p.fixtures, p.addOns),
      }));
    },

    finalize() {
      mutate((p) => ({ ...p, status: "shared" }));
    },
  };
});
