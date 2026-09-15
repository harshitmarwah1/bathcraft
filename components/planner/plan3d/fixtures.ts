import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { AddOnType, FixtureType, FixtureVariant, Placement } from "@/lib/planner/types";
import type { StyleKit } from "./textures";

/*
 * Procedural fixture models. Every builder works in the fixture's own frame:
 * origin at the centre of its floor footprint, width along X, depth along Z,
 * the back (the wall it stands against) at z = -depth/2, facing +Z into the
 * room. The scene rotates and places the group from the layout engine's box.
 */

export interface KitMaterials {
  ceramic: THREE.MeshPhysicalMaterial;
  ceramicInside: THREE.MeshPhysicalMaterial;
  metal: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  counter: THREE.MeshStandardMaterial;
  panel: THREE.MeshStandardMaterial;
  tray: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  mirror: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  glow: THREE.MeshStandardMaterial;
}

export function makeKitMaterials(kit: StyleKit, counterMap: THREE.Texture): KitMaterials {
  const ceramic = new THREE.MeshPhysicalMaterial({
    color: kit.ceramic,
    roughness: 0.14,
    clearcoat: 0.7,
    clearcoatRoughness: 0.08,
  });
  const ceramicInside = ceramic.clone();
  ceramicInside.side = THREE.DoubleSide;
  return {
    ceramic,
    ceramicInside,
    metal: new THREE.MeshStandardMaterial({ ...kit.metal }),
    wood: new THREE.MeshStandardMaterial({ color: kit.wood, roughness: 0.62 }),
    counter: new THREE.MeshStandardMaterial({ map: counterMap, roughness: kit.counter.roughness }),
    panel: new THREE.MeshStandardMaterial({ color: kit.panel, roughness: 0.45 }),
    tray: new THREE.MeshStandardMaterial({ color: "#d6d3cd", roughness: 0.5 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#eef1ef",
      roughness: 0.04,
      metalness: 0,
      transmission: 0.92,
      thickness: 0.01,
      transparent: true,
      opacity: 0.55,
    }),
    mirror: new THREE.MeshStandardMaterial({ color: "#d3dbde", metalness: 1, roughness: 0.04 }),
    dark: new THREE.MeshStandardMaterial({ color: "#2b2c2e", roughness: 0.45 }),
    glow: new THREE.MeshStandardMaterial({ color: kit.light, emissive: kit.light, emissiveIntensity: 0 }),
  };
}

export function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Rounded box, with the radius clamped so thin panels never invert. */
export function rbox(w: number, h: number, d: number, r = 0.012): THREE.BufferGeometry {
  const safe = Math.max(0.0005, Math.min(r, w / 2 - 0.0005, h / 2 - 0.0005, d / 2 - 0.0005));
  return new RoundedBoxGeometry(w, h, d, 3, safe);
}

export interface BuiltFixture {
  group: THREE.Group;
  /** Parts fitted during finishing (glass, mirror, lights), revealed separately. */
  late: THREE.Object3D[];
}

function faucet(M: KitMaterials, x: number, y: number, z: number, reach: number): THREE.Group {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.26, 24), M.metal, 0, 0.13, 0));
  g.add(mesh(rbox(0.03, 0.03, reach, 0.012), M.metal, 0, 0.25, reach / 2));
  g.position.set(x, y, z);
  return g;
}

function buildWc(w: number, d: number, variant: FixtureVariant | undefined, M: KitMaterials): BuiltFixture {
  const g = new THREE.Group();
  const back = -d / 2;
  const hung = variant === "wallHung" || variant === "smart";
  const bowlY = hung ? 0.4 : 0.36;

  const bowl = mesh(new THREE.SphereGeometry(1, 40, 24), M.ceramic, 0, bowlY, back + 0.38);
  bowl.scale.set(0.19, 0.13, 0.27);
  g.add(bowl);
  g.add(mesh(rbox(0.38, 0.035, 0.5, 0.016), M.ceramic, 0, bowlY + 0.13, back + 0.36));

  if (hung) {
    g.add(mesh(rbox(Math.min(w * 0.92, 0.6), 1.1, 0.14, 0.01), M.panel, 0, 0.55, back + 0.07));
    g.add(mesh(rbox(0.22, 0.14, 0.012, 0.004), M.metal, 0, 0.98, back + 0.146));
    if (variant === "smart") {
      const strip = mesh(rbox(0.28, 0.008, 0.02, 0.003), M.glow, 0, 0.26, back + 0.3);
      strip.castShadow = false;
      g.add(strip);
    }
  } else {
    g.add(mesh(rbox(0.24, 0.3, 0.3, 0.07), M.ceramic, 0, 0.15, back + 0.36));
    g.add(mesh(rbox(0.44, 0.4, 0.17, 0.03), M.ceramic, 0, 0.62, back + 0.1));
    g.add(mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.012, 24), M.metal, 0, 0.826, back + 0.1));
  }
  return { group: g, late: [] };
}

function buildVanity(w: number, d: number, variant: FixtureVariant | undefined, M: KitMaterials): BuiltFixture {
  const g = new THREE.Group();
  const late: THREE.Object3D[] = [];
  const back = -d / 2;
  const top = 0.86;

  if (variant === "pedestal") {
    g.add(mesh(new THREE.CylinderGeometry(0.085, 0.12, top - 0.08, 32), M.ceramic, 0, (top - 0.08) / 2, back + 0.24));
    const bowl = mesh(new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.ceramicInside, 0, top, back + 0.26);
    bowl.scale.set(0.3, 0.16, 0.24);
    g.add(bowl);
    g.add(faucet(M, 0, top - 0.02, back + 0.05, 0.12));
  } else {
    const hung = variant === "wallHungBasin";
    const cabH = hung ? 0.14 : 0.52;
    g.add(mesh(rbox(w, cabH, d * 0.96, 0.01), hung ? M.counter : M.wood, 0, top - 0.04 - cabH / 2, back + d * 0.48));
    if (!hung) {
      g.add(mesh(rbox(w * 0.42, 0.012, 0.014, 0.005), M.metal, 0, top - 0.13, back + d * 0.96 + 0.006));
      g.add(mesh(rbox(w - 0.02, 0.004, 0.004, 0.001), M.dark, 0, top - 0.3, back + d * 0.96 + 0.002));
    }
    g.add(mesh(rbox(w + 0.02, 0.04, d, 0.006), M.counter, 0, top - 0.02, back + d / 2));
    if (hung) {
      const sink = mesh(new THREE.CircleGeometry(1, 40), M.dark, 0, top + 0.001, back + d * 0.55);
      sink.rotation.x = -Math.PI / 2;
      sink.scale.set(0.2, 0.14, 1);
      g.add(sink);
    } else {
      const bowl = mesh(new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.ceramicInside, 0, top + 0.13, back + d * 0.56);
      bowl.scale.set(0.22, 0.13, 0.17);
      g.add(bowl);
    }
    g.add(faucet(M, 0, top, back + 0.07, Math.max(0.1, d * 0.3)));
  }

  // Mirror and a warm light above it are fitted at the very end.
  const mirror = mesh(rbox(Math.min(w * 0.85, 0.9), 0.78, 0.02, 0.01), M.mirror, 0, 1.58, back + 0.012);
  mirror.castShadow = false;
  const lamp = mesh(rbox(Math.min(w * 0.6, 0.6), 0.03, 0.05, 0.012), M.glow, 0, 2.02, back + 0.03);
  lamp.castShadow = false;
  late.push(mirror, lamp);
  g.add(mirror, lamp);
  return { group: g, late };
}

function buildShower(w: number, d: number, variant: FixtureVariant | undefined, placement: Placement, M: KitMaterials): BuiltFixture {
  const g = new THREE.Group();
  const late: THREE.Object3D[] = [];
  const back = -d / 2;

  if (placement === "tubCombo") {
    g.add(mesh(rbox(w, 0.55, Math.min(d, 0.8), 0.05), M.ceramic, 0, 0.275, back + Math.min(d, 0.8) / 2));
  } else {
    g.add(mesh(rbox(w, 0.03, d, 0.004), M.tray, 0, 0.015, 0));
    g.add(mesh(rbox(w * 0.6, 0.005, 0.05, 0.002), M.metal, 0, 0.033, back + 0.12));
  }

  // Mixer valve on the wet wall.
  const mixer = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.025, 32), M.metal, 0, 1.05, back + 0.012);
  mixer.rotation.x = Math.PI / 2;
  g.add(mixer);

  if (variant === "rainShower") {
    g.add(mesh(rbox(0.025, 0.025, 0.36, 0.01), M.metal, 0, 2.1, back + 0.18));
    g.add(mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.012, 48), M.metal, 0, 2.08, back + 0.36));
  } else if (variant === "showerPanel") {
    g.add(mesh(rbox(0.22, 1.3, 0.05, 0.01), M.dark, 0, 1.2, back + 0.03));
    g.add(mesh(rbox(0.2, 0.012, 0.055, 0.004), M.metal, 0, 1.86, back + 0.03));
  } else {
    g.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.75, 16), M.metal, w * 0.22, 1.35, back + 0.035));
    const head = mesh(new THREE.CylinderGeometry(0.035, 0.022, 0.2, 24), M.metal, w * 0.22, 1.62, back + 0.07);
    head.rotation.x = 0.5;
    g.add(head);
  }

  // Glass is the last thing a plumber fits.
  const glassH = 1.95;
  if (placement === "enclosed") {
    const front = mesh(rbox(w, glassH, 0.01, 0.002), M.glass, 0, glassH / 2 + 0.03, d / 2 - 0.01);
    const side = mesh(rbox(0.01, glassH, d, 0.002), M.glass, w / 2 - 0.01, glassH / 2 + 0.03, 0);
    late.push(front, side);
  } else {
    const panelW = placement === "tubCombo" ? w * 0.5 : w * 0.62;
    const panel = mesh(rbox(panelW, glassH, 0.01, 0.002), M.glass, -w / 2 + panelW / 2, glassH / 2 + 0.03, d / 2 - 0.01);
    late.push(panel);
    late.push(mesh(rbox(0.015, 0.015, d / 2, 0.005), M.metal, -w / 2 + panelW, glassH + 0.03, d / 4));
  }
  for (const part of late) {
    part.castShadow = false;
    g.add(part);
  }
  return { group: g, late };
}

function buildAlmirah(w: number, d: number, variant: FixtureVariant | undefined, M: KitMaterials): BuiltFixture {
  const g = new THREE.Group();
  const back = -d / 2;
  if (variant === "openShelf") {
    for (const y of [0.95, 1.25, 1.55]) {
      g.add(mesh(rbox(w, 0.03, Math.min(d, 0.28), 0.006), M.wood, 0, y, back + Math.min(d, 0.28) / 2));
    }
  } else if (variant === "tallUnit") {
    g.add(mesh(rbox(w, 1.8, d, 0.012), M.wood, 0, 0.9 + 0.05, 0));
    g.add(mesh(rbox(0.012, 0.3, 0.015, 0.005), M.metal, w / 2 - 0.05, 1.05, d / 2 + 0.008));
  } else {
    const depth = Math.min(d, 0.16);
    g.add(mesh(rbox(w, 0.7, depth, 0.01), M.wood, 0, 1.55, back + depth / 2));
    const glass = mesh(rbox(w - 0.03, 0.66, 0.006, 0.003), M.mirror, 0, 1.55, back + depth + 0.003);
    glass.castShadow = false;
    g.add(glass);
  }
  return { group: g, late: [] };
}

export function buildFixture(
  type: FixtureType,
  widthM: number,
  depthM: number,
  variant: FixtureVariant | undefined,
  placement: Placement,
  M: KitMaterials,
): BuiltFixture {
  switch (type) {
    case "wc":
      return buildWc(widthM, depthM, variant, M);
    case "vanity":
      return buildVanity(widthM, depthM, variant, M);
    case "shower":
      return buildShower(widthM, depthM, variant, placement, M);
    case "almirah":
      return buildAlmirah(widthM, depthM, variant, M);
  }
}

/** Wall- or floor-mounted add-ons, in a frame whose origin sits on the wall's
 *  inner face at floor level, facing +Z into the room. */
export function buildAddOn(type: AddOnType, M: KitMaterials): THREE.Object3D {
  const g = new THREE.Group();
  switch (type) {
    case "geyser": {
      const tank = mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.55, 40), M.ceramic, 0, 2.08, 0.19);
      tank.rotation.z = Math.PI / 2;
      g.add(tank);
      g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 24), M.dark, 0.2, 2.08, 0.365).rotateX(Math.PI / 2));
      break;
    }
    case "exhaustFan":
      g.add(mesh(rbox(0.26, 0.26, 0.04, 0.02), M.panel, 0, 2.3, 0.02));
      for (let i = 0; i < 5; i++) g.add(mesh(rbox(0.2, 0.008, 0.01, 0.003), M.dark, 0, 2.22 + i * 0.04, 0.042));
      break;
    case "towelRail":
      g.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.6, 16), M.metal, 0, 1.25, 0.08).rotateZ(Math.PI / 2));
      g.add(mesh(rbox(0.02, 0.02, 0.08, 0.008), M.metal, -0.28, 1.25, 0.04));
      g.add(mesh(rbox(0.02, 0.02, 0.08, 0.008), M.metal, 0.28, 1.25, 0.04));
      break;
    case "healthFaucet":
      g.add(mesh(new THREE.CylinderGeometry(0.02, 0.016, 0.12, 20), M.metal, 0, 0.6, 0.05).rotateX(Math.PI / 2));
      break;
    case "floorDrain":
      g.add(mesh(rbox(0.12, 0.004, 0.12, 0.002), M.metal, 0, 0.034, 0.6));
      break;
    case "niche":
      g.add(mesh(rbox(0.42, 0.52, 0.02, 0.004), M.dark, 0, 1.25, 0.011));
      g.add(mesh(rbox(0.4, 0.015, 0.1, 0.003), M.counter, 0, 1.04, 0.05));
      break;
  }
  return g;
}
