import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isHomePage() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  return path === "/" || path.endsWith("/index.html");
}

function isBrowsingMembershipPlans() {
  const hash = (window.location.hash || "").toLowerCase();
  return hash === "#memsec-section" || hash === "#membership-section";
}

function dashboardUrl() {
  const enrollment = readJson("astikanLastEnrollment");
  const id = enrollment?.enrollmentId;
  return id
    ? `membership-dashboard.html?enrollmentId=${encodeURIComponent(id)}`
    : "membership-dashboard.html";
}

async function restoreEnrollmentForUser(user) {
  if (!user?.uid || !window.AstikanEnrollmentStore) return null;
  return window.AstikanEnrollmentStore.restoreEnrollmentForUser(user);
}

async function goToDashboard(user) {
  if (user) {
    if (!readJson("astikanMemberSession") && window.astikanPersistMemberSession) {
      window.astikanPersistMemberSession(user);
    }
    await restoreEnrollmentForUser(user);
  }
  window.location.replace(dashboardUrl());
}

async function redirectLoggedInMemberToDashboard() {
  if (!isHomePage() || isBrowsingMembershipPlans()) return false;

  const session = readJson("astikanMemberSession");
  if (session?.uid) {
    await restoreEnrollmentForUser({ uid: session.uid });
    window.location.replace(dashboardUrl());
    return true;
  }

  return false;
}

function getFirebaseConfig() {
  const config = window.ASTIKAN_CONFIG?.firebase;
  if (!config?.apiKey || !config?.authDomain || !config?.projectId || !config?.appId) {
    throw new Error("Load assets/astikan-config.js before home-auth.js");
  }
  return config;
}

const app = getApps().length ? getApp() : initializeApp(getFirebaseConfig());
const auth = getAuth(app);

redirectLoggedInMemberToDashboard().then((redirected) => {
  if (redirected) return;

  onAuthStateChanged(auth, async (user) => {
    if (!user || !isHomePage() || isBrowsingMembershipPlans()) return;
    await goToDashboard(user);
  });
});

document.querySelectorAll(".google-auth-btn").forEach((button) => {
  button.classList.add("astikan-member-login-btn");
});