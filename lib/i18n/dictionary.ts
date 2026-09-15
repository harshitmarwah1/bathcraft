/**
 * Hindi translations, keyed by the English source string.
 *
 * Keyed by the English rather than by invented ids (`hero.title` and friends)
 * for two reasons: there is nothing to keep in sync, and a string that has not
 * been translated yet falls back to readable English instead of rendering a
 * broken token in front of a user.
 *
 * What is deliberately NOT translated:
 *   • "Milagro Universe" and the brand names (Jaquar, CERA, Hindware, KOHLER, GROHE) —
 *     these are trademarks and read the same in both languages.
 *   • Numerals and units in the prototype figures (10K+, 4.8/5, 8.0 ft).
 *   • Customer names in the testimonials.
 */
export const hi: Record<string, string> = {
  /* ── navigation ─────────────────────────────────────────────────────── */
  "Home": "होम",
  "How it works": "यह कैसे काम करता है",
  "Products": "उत्पाद",
  "Inspiration": "प्रेरणा",
  "Pricing": "मूल्य",
  "About": "हमारे बारे में",
  "Features": "विशेषताएँ",
  "Blog": "ब्लॉग",
  "Help": "सहायता",
  "Search": "खोजें",
  "Open menu": "मेन्यू खोलें",
  "Close menu": "मेन्यू बंद करें",
  "Sign in": "साइन इन",
  "Get Started": "शुरू करें",

  /* ── hero ───────────────────────────────────────────────────────────── */
  "Better bathrooms. Brighter spaces.": "बेहतर बाथरूम। उज्ज्वल जगहें।",
  "From ideas to": "विचारों से",
  "beautiful bathrooms": "सुंदर बाथरूम तक",
  "Plan, visualize, estimate and build — all in one place.":
    "योजना बनाएँ, देखें, अनुमान लगाएँ और बनाएँ — सब एक ही जगह।",
  "Start Planning Free": "मुफ़्त योजना शुरू करें",
  "Watch Video": "वीडियो देखें",
  "Design it.": "डिज़ाइन करें।",
  "Plan it.": "योजना बनाएँ।",
  "Build it.": "बनाएँ।",
  "Scroll": "स्क्रॉल करें",
  "Happy homeowners": "खुश गृहस्वामी",
  "Average rating": "औसत रेटिंग",
  "Trusted brands": "भरोसेमंद ब्रांड",
  "Average cost savings": "औसत लागत बचत",

  /* ── value propositions ─────────────────────────────────────────────── */
  "Visualize before you build": "बनाने से पहले देखें",
  "See your bathroom in 2D & 3D": "अपना बाथरूम 2D और 3D में देखें",
  "Get accurate estimates": "सटीक अनुमान पाएँ",
  "No surprise costs": "कोई छिपी हुई लागत नहीं",
  "Find the right products": "सही उत्पाद चुनें",
  "Trusted brands & local stores": "भरोसेमंद ब्रांड और स्थानीय दुकानें",
  "Plan with confidence": "आत्मविश्वास से योजना बनाएँ",
  "Save time, money and effort": "समय, पैसा और मेहनत बचाएँ",

  /* ── how it works ───────────────────────────────────────────────────── */
  "Add your measurements": "अपने माप दर्ज करें",
  "Enter your bathroom size and existing elements.":
    "अपने बाथरूम का आकार और मौजूदा चीज़ें दर्ज करें।",
  "Get a smart plan": "एक स्मार्ट योजना पाएँ",
  "See 2D layouts and optimized suggestions.": "2D लेआउट और बेहतर सुझाव देखें।",
  "Choose your style": "अपनी शैली चुनें",
  "Explore designs, tiles and fittings that match your taste.":
    "अपनी पसंद के डिज़ाइन, टाइलें और फ़िटिंग देखें।",
  "Get material list": "सामग्री सूची पाएँ",
  "Exact quantities, estimated cost and brand recommendations.":
    "सटीक मात्रा, अनुमानित लागत और ब्रांड सुझाव।",

  /* ── planner ────────────────────────────────────────────────────────── */
  "See it.": "देखें।",
  "Change it.": "बदलें।",
  "Perfect it.": "सँवारें।",
  "Try the Planner": "प्लानर आज़माएँ",
  "Toilet": "टॉयलेट",
  "Sink": "बेसिन",
  "Shower": "शॉवर",
  "Cabinet": "अलमारी",
  "Bathtub": "बाथटब",
  "Bathroom fixtures": "बाथरूम फ़िक्स्चर",

  /* ── measurements & materials ───────────────────────────────────────── */
  "Length": "लंबाई",
  "Width": "चौड़ाई",
  "Height": "ऊँचाई",
  "Tiles": "टाइलें",
  "PVC Pipe": "पीवीसी पाइप",
  "Angle Valve": "एंगल वाल्व",
  "Cement": "सीमेंट",

  /* ── styles & tiles ─────────────────────────────────────────────────── */
  "Modern": "आधुनिक",
  "Traditional": "पारंपरिक",
  "Minimal": "सादगीपूर्ण",
  "Luxury": "शानदार",
  "White marble": "सफ़ेद संगमरमर",
  "Cream stone": "क्रीम पत्थर",
  "Dark slate": "गहरा स्लेट",
  "Glazed blue": "चमकदार नीला",
  "Terracotta": "टेराकोटा",
  "Warm wood": "गर्म लकड़ी",
  "View all brands": "सभी ब्रांड देखें",
  "Try now": "अभी आज़माएँ",

  /* ── testimonials ───────────────────────────────────────────────────── */
  "Homeowner, Bengaluru": "गृहस्वामी, बेंगलुरु",
  "Homeowner, Mumbai": "गृहस्वामी, मुंबई",
  "Homeowner, Pune": "गृहस्वामी, पुणे",

  /* ── footer & socials ───────────────────────────────────────────────── */
  "Instagram": "इंस्टाग्राम",
  "YouTube": "यूट्यूब",
  "LinkedIn": "लिंक्डइन",

  /* ── authentication ─────────────────────────────────────────────────── */
  "Email address": "ईमेल पता",
  "Password": "पासवर्ड",
  "Enter your password": "अपना पासवर्ड डालें",
  "Remember me": "मुझे याद रखें",
  "Forgot password?": "पासवर्ड भूल गए?",
  "Sign In": "साइन इन",
  "Signing in…": "साइन इन हो रहा है…",
  "Continue with Google": "Google से जारी रखें",
  "Connecting to Google…": "Google से जुड़ रहे हैं…",
  "New to Milagro Universe?": "Milagro Universe पर नए हैं?",
  "Create an account": "खाता बनाएँ",
  "Show password": "पासवर्ड दिखाएँ",
  "Hide password": "पासवर्ड छिपाएँ",
  "We couldn't sign you in.": "हम आपको साइन इन नहीं कर सके।",
  "Please check your email and password and try again.":
    "कृपया अपना ईमेल और पासवर्ड जाँचें और फिर कोशिश करें।",
  "We couldn't reach Milagro Universe. Check your connection and try again.":
    "हम Milagro Universe तक नहीं पहुँच सके। अपना कनेक्शन जाँचें और फिर कोशिश करें।",
  "We couldn't sign you in with Google.": "हम आपको Google से साइन इन नहीं कर सके।",

  "Create your Milagro Universe account": "अपना Milagro Universe खाता बनाएँ",
  "Start planning your bathroom with clarity and confidence.":
    "स्पष्टता और आत्मविश्वास के साथ अपने बाथरूम की योजना बनाना शुरू करें।",
  "First name": "पहला नाम",
  "Last name": "अंतिम नाम",
  "Create a password": "पासवर्ड बनाएँ",
  "Confirm password": "पासवर्ड की पुष्टि करें",
  "Re-enter your password": "अपना पासवर्ड दोबारा डालें",
  "Create Account": "खाता बनाएँ",
  "Creating account…": "खाता बन रहा है…",
  "Already have an account?": "पहले से खाता है?",
  "Use at least 8 characters with a mix of letters and numbers.":
    "कम से कम 8 अक्षर इस्तेमाल करें, जिनमें अक्षर और अंक दोनों हों।",
  "8+ characters": "8+ अक्षर",
  "One uppercase letter": "एक बड़ा अक्षर",
  "One number": "एक अंक",
  "Terms of Service": "सेवा की शर्तें",
  "Privacy Policy": "गोपनीयता नीति",
  "We couldn't create your account.": "हम आपका खाता नहीं बना सके।",
  "An account with that email already exists.": "इस ईमेल से पहले से एक खाता मौजूद है।",

  "Your Milagro Universe account is ready.": "आपका Milagro Universe खाता तैयार है।",
  "Start My First Bathroom": "मेरा पहला बाथरूम शुरू करें",
  "Explore Milagro Universe": "Milagro Universe देखें",

  "Plan better.": "बेहतर योजना बनाएँ।",
  "Build with confidence.": "आत्मविश्वास से बनाएँ।",
  "Better Decisions": "बेहतर निर्णय",
  "Save Time & Money": "समय और पैसे की बचत",
  "Beautiful Results": "सुंदर परिणाम",

  /* ── onboarding ─────────────────────────────────────────────────────── */
  "What would you like to call this bathroom?": "आप इस बाथरूम को क्या नाम देना चाहेंगे?",
  "Bathroom name": "बाथरूम का नाम",
  "e.g. Master Bathroom": "जैसे मास्टर बाथरूम",
  "Give this bathroom a name so you can find it later.":
    "इस बाथरूम को एक नाम दें ताकि आप इसे बाद में ढूँढ़ सकें।",
  "What are you planning?": "आप क्या योजना बना रहे हैं?",
  "Renovating an existing bathroom": "मौजूदा बाथरूम का नवीनीकरण",
  "Building a new bathroom": "नया बाथरूम बनाना",
  "Exploring ideas for now": "अभी सिर्फ़ विचार देख रहे हैं",
  "What matters most to you?": "आपके लिए सबसे ज़रूरी क्या है?",
  "Choose as many as you like.": "जितने चाहें उतने चुनें।",
  "Stay within budget": "बजट में रहें",
  "Make better use of space": "जगह का बेहतर उपयोग करें",
  "Visualize before building": "बनाने से पहले देखें",
  "Choose the right products": "सही उत्पाद चुनें",
  "Avoid renovation mistakes": "नवीनीकरण की गलतियों से बचें",
  "Create a premium bathroom": "एक प्रीमियम बाथरूम बनाएँ",
  "Continue": "आगे बढ़ें",
  "Start planning": "योजना शुरू करें",
  "About you": "आपके बारे में",
  "Next, you’ll plan": "आगे, आप योजना बनाएँगे",
  "Saving…": "सहेजा जा रहा है…",
  "Onboarding progress": "प्रक्रिया की प्रगति",

  /* ── account & dashboard ────────────────────────────────────────────── */
  "My Bathrooms": "मेरे बाथरूम",
  "My Plans": "मेरी योजनाएँ",
  "Saved Inspiration": "सहेजी गई प्रेरणा",
  "Account Settings": "खाता सेटिंग",
  "Sign Out": "साइन आउट",
  "Account": "खाता",
  "Picking up where you left off.": "वहीं से आगे, जहाँ आपने छोड़ा था।",
  "Continue planning": "योजना जारी रखें",
  "Open the Planner": "प्लानर खोलें",
  "Open": "खोलें",
  "Delete": "हटाएं",
  "New bathroom": "नया बाथरूम",
  "Pick up any plan, or start a new one.": "कोई भी प्लान जारी रखें, या नया शुरू करें।",
  "No measurements yet": "अभी कोई माप नहीं",
  "Start with a name and a few measurements — Milagro Universe takes it from there.":
    "एक नाम और कुछ माप से शुरू करें — आगे Milagro Universe सँभाल लेगा।",
  "Create Your First Bathroom": "अपना पहला बाथरूम बनाएँ",

  /* ── errors ─────────────────────────────────────────────────────────── */
  "Try Again": "फिर कोशिश करें",
  "This email already has a Milagro Universe account.":
    "इस ईमेल से पहले से एक Milagro Universe खाता मौजूद है।",
  "Google sign-in was cancelled.": "Google साइन-इन रद्द कर दिया गया।",
  "Your session has expired.": "आपका सत्र समाप्त हो गया है।",
  "Google sign-in isn't set up yet.": "Google साइन-इन अभी सेट नहीं किया गया है।",

  /* ── theme & language controls ──────────────────────────────────────── */
  "Switch to dark theme": "डार्क थीम पर जाएँ",
  "Switch to light theme": "लाइट थीम पर जाएँ",
};

/* Strings found while wiring the sections. Kept in a second block rather than
   merged above so the translation pass is visible in the diff. */
Object.assign(hi, {
  "Your bathroom, your way": "आपका बाथरूम, आपके तरीके से",
  "A simpler way": "एक आसान तरीका",
  "to plan your bathroom": "अपने बाथरूम की योजना बनाने का",
  "Whether you're renovating or building new, Milagro Universe helps you make better decisions with clear plans, real products and accurate estimates.":
    "चाहे आप नवीनीकरण कर रहे हों या नया बना रहे हों, Milagro Universe स्पष्ट योजनाओं, असली उत्पादों और सटीक अनुमानों के साथ बेहतर निर्णय लेने में मदद करता है।",
  "Start Your Plan": "अपनी योजना शुरू करें",
  "Your measurements": "आपके माप",
  "Your dream": "आपका सपनों का",
  "bathroom": "बाथरूम",
  "Plan Better. Build Smarter.": "बेहतर योजना। समझदारी से निर्माण।",
  "All rights reserved.": "सर्वाधिकार सुरक्षित।",
  "Ready to plan your bathroom?": "अपने बाथरूम की योजना बनाने के लिए तैयार हैं?",
  "Less confusion. Better choices. A smoother renovation journey.":
    "कम उलझन। बेहतर विकल्प। आसान नवीनीकरण यात्रा।",
  "Top brands. Real comparisons.": "शीर्ष ब्रांड। असली तुलना।",
  "Compare prices, warranty and service for trusted brands.":
    "भरोसेमंद ब्रांडों के दाम, वारंटी और सेवा की तुलना करें।",
  "Explore styles for every home": "हर घर के लिए शैलियाँ देखें",
  "From modern to traditional, we have ideas for every taste and budget.":
    "आधुनिक से पारंपरिक तक, हर पसंद और बजट के लिए हमारे पास विचार हैं।",
  "Explore": "देखें",
  "bathrooms": "बाथरूम",
  "Trusted by homeowners like you": "आप जैसे गृहस्वामियों का भरोसा",
  "Real stories. Real bathrooms. Real confidence.":
    "असली कहानियाँ। असली बाथरूम। असली भरोसा।",
});

Object.assign(hi, {
  "How Milagro Universe works": "Milagro Universe कैसे काम करता है",
  "Plan. Visualize. Build. In 4 simple steps.":
    "योजना। कल्पना। निर्माण। 4 आसान चरणों में।",
  "Bathroom": "बाथरूम",
  "Next": "आगे",
  "Try tiles and wallpapers instantly": "टाइलें और वॉलपेपर तुरंत आज़माएँ",
  "Upload a brochure or pick from our library.":
    "कोई ब्रोशर अपलोड करें या हमारी लाइब्रेरी से चुनें।",
});

Object.assign(hi, {
  /* auth layout + forgot password */
  "Milagro Universe — home": "Milagro Universe — होम",
  "Milagro Universe — back to home": "Milagro Universe — होम पर वापस",
  "Plan · Visualize · Build": "योजना · कल्पना · निर्माण",
  "Save your bathroom plans, compare ideas, track materials and continue your renovation journey from anywhere.":
    "अपनी बाथरूम योजनाएँ सहेजें, विचारों की तुलना करें, सामग्री पर नज़र रखें और कहीं से भी अपना नवीनीकरण जारी रखें।",
  "Your dream bathroom starts with a plan.":
    "आपका सपनों का बाथरूम एक योजना से शुरू होता है।",
  "Better": "बेहतर",
  "Decisions": "निर्णय",
  "Save Time": "समय बचाएँ",
  "& Money": "और पैसा",
  "Beautiful": "सुंदर",
  "Results": "परिणाम",
  "Check your inbox": "अपना इनबॉक्स देखें",
  "We’ve sent a password reset link to:": "हमने पासवर्ड रीसेट लिंक भेजा है:",
  "Back to Sign In": "साइन इन पर वापस",
  "Forgot your password?": "पासवर्ड भूल गए?",
  "Enter your email and we’ll send you a reset link.":
    "अपना ईमेल डालें और हम आपको रीसेट लिंक भेज देंगे।",
  "Sending…": "भेजा जा रहा है…",
  "Send Reset Link": "रीसेट लिंक भेजें",
  "Loading your account…": "आपका खाता लोड हो रहा है…",

  /* forms */
  "Please accept the Terms of Service to continue.":
    "जारी रखने के लिए कृपया सेवा की शर्तें स्वीकार करें।",
  "Your account was created, but we couldn't sign you in. Please sign in.":
    "आपका खाता बन गया, लेकिन हम आपको साइन इन नहीं कर सके। कृपया साइन इन करें।",
  "I agree to the": "मैं सहमत हूँ",
  "and": "और",

  /* onboarding + dashboard */
  "Step": "चरण",
  "of": "में से",
  "Let’s create your first bathroom.": "आइए आपका पहला बाथरूम बनाएँ।",
  "Let’s start planning your bathroom.":
    "आइए आपके बाथरूम की योजना बनाना शुरू करें।",
  "← Back": "← पीछे",
  "priorities set": "प्राथमिकताएँ तय",
  "You haven't created a bathroom yet.": "आपने अभी तक कोई बाथरूम नहीं बनाया है।",

  /* hero + planner + video */
  "A warm, softly lit bathroom with a freestanding stone bath, a glass shower and a timber vanity":
    "एक गर्म, मुलायम रोशनी वाला बाथरूम जिसमें अलग खड़ा पत्थर का टब, काँच का शॉवर और लकड़ी की वैनिटी है",
  "Watch Milagro Universe renovation video": "Milagro Universe नवीनीकरण वीडियो देखें",
  "Take Control of Your Bathroom Renovation":
    "अपने बाथरूम के नवीनीकरण की कमान सँभालें",
  "Close video": "वीडियो बंद करें",
  "Drag, drop and explore different layouts, fittings, tiles and colours before you start building.":
    "बनाना शुरू करने से पहले अलग-अलग लेआउट, फ़िटिंग, टाइलें और रंग खींचकर आज़माएँ।",
  "Move & explore": "हिलाएँ और देखें",
  "drag, or move with the arrow keys": "खींचें, या तीर कुंजियों से हिलाएँ",
  "Fixture": "फ़िक्स्चर",
});

/* Caught by `npm run check:i18n` — these are reached through t("…") literals
   but had no entry, so they were silently falling back to English. */
Object.assign(hi, {
  "Let’s bring your bathroom to life.": "आइए आपके बाथरूम को साकार करें।",
  "Sign in to continue planning, comparing and designing.":
    "योजना बनाना, तुलना करना और डिज़ाइन करना जारी रखने के लिए साइन इन करें।",
  "Let's build a better bathroom, together.": "आइए मिलकर एक बेहतर बाथरूम बनाएँ।",
  "Your perfect bathroom is just a few clicks away.":
    "आपका आदर्श बाथरूम बस कुछ ही क्लिक दूर है।",
  "Switch to Hindi": "हिन्दी में देखें",
});

Object.assign(hi, {
  "Your browser cannot play this video.": "आपका ब्राउज़र यह वीडियो नहीं चला सकता।",
  "Watch Again": "फिर देखें",
  "See it. Plan it. Build it.": "देखें। योजना बनाएँ। बनाएँ।",
  "Without renovation regrets.": "बिना किसी पछतावे के।",

  /* ── My Bathrooms dashboard ────────────────────────────────────────── */
  "Budget friendly": "बजट के अनुकूल",
  "Cost effective": "किफ़ायती",
  "Good quality": "अच्छी गुणवत्ता",
  "Top of the line": "सबसे बेहतरीन",
  "Shared with contractor": "ठेकेदार के साथ साझा किया गया",
  "Brief saved": "ब्रीफ सेव हो गया",
  "Estimate ready": "अनुमान तैयार",
  "4D plan ready": "4D प्लान तैयार",
  "Measurements added": "माप जोड़े गए",
  "Start a new bathroom": "नया बाथरूम शुरू करें",
  "Plan a guest bath, a kids' bath or a powder room alongside this one.": "इसके साथ गेस्ट बाथ, बच्चों का बाथ या पाउडर रूम भी प्लान करें।",
  "Finish level": "फ़िनिश स्तर",
  "Estimate": "अनुमान",
  "Not yet": "अभी नहीं",
  "Measure & choose a style": "नाप लें और स्टाइल चुनें",
  "Enter the room size, place the door and window, and pick the look you want.": "कमरे का आकार डालें, दरवाज़ा और खिड़की रखें, और अपना पसंदीदा लुक चुनें।",
  "Open measurements": "माप खोलें",
  "See it in 4D": "इसे 4D में देखें",
  "Walk around your bathroom in 3D and play the build, day by day.": "अपने बाथरूम को 3D में घूमकर देखें और दिन-ब-दिन निर्माण चलाएं।",
  "Open the 4D plan": "4D प्लान खोलें",
  "Get the estimate & share": "अनुमान पाएं और साझा करें",
  "Check materials and cost, then send the brief to your contractor.": "सामग्री और लागत देखें, फिर ब्रीफ अपने ठेकेदार को भेजें।",
  "Open the brief": "ब्रीफ खोलें",
  "Make the most of your plan": "अपने प्लान का पूरा फ़ायदा उठाएं",
});
