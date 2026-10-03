import { useEffect, useRef, useState } from "react";
import { load } from "@tauri-apps/plugin-store";

import {
  scenes,
  openingMs,
  closingMs,
  allSceneSources,
} from "./frames";

import "./App.css";

type Course = {
  id: number;
  code: string;
  name: string;
};

type StudySession = {
  id: number;
  courseId: number;
  duration: number;
  date: string;
};

type PersistedData = {
  setupComplete: boolean;
  semesterName: string;
  courses: Course[];
  sessions: StudySession[];
};

type CompanionState =
  | "idle"
  | "opening"
  | "studying"
  | "paused"
  | "closing"
  | "complete";

type DurationOption = {
  label: string;
  seconds: number;
};

const initialCourses: Course[] = [
  {
    id: 1,
    code: "NCIS301",
    name: "Database Systems",
  },
  {
    id: 2,
    code: "NCSC305",
    name: "Parallel & Distributed Computing",
  },
  {
    id: 3,
    code: "NHAI300",
    name: "Image Processing",
  },
  {
    id: 4,
    code: "NHAI302",
    name: "Deep Learning",
  },
  {
    id: 5,
    code: "NMMS301",
    name: "Research Methods & Report Writing",
  },
];

const durationOptions: DurationOption[] = [
  {
    label: "25 min",
    seconds: 25 * 60,
  },
  {
    label: "30 min",
    seconds: 30 * 60,
  },
  {
    label: "45 min",
    seconds: 45 * 60,
  },
  {
    label: "1 hour",
    seconds: 60 * 60,
  },
  {
    label: "1.5 hours",
    seconds: 90 * 60,
  },
  {
    label: "2 hours",
    seconds: 120 * 60,
  },
];

function App() {
  // ==================================================
  // APP DATA
  // ==================================================

  const [setupComplete, setSetupComplete] =
    useState(false);

  const [semesterName, setSemesterName] =
    useState("2026 Semester 1");

  const [courses, setCourses] =
    useState<Course[]>(initialCourses);

  const [newCode, setNewCode] =
    useState("");

  const [newCourseName, setNewCourseName] =
    useState("");

  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  /*
   * activeCourse is the course locked to the
   * current study session.
   *
   * selectedCourse = dashboard selection
   * activeCourse   = course currently being studied
   */
  const [activeCourse, setActiveCourse] =
    useState<Course | null>(null);

  const [sessions, setSessions] =
    useState<StudySession[]>([]);

  const [store, setStore] = useState<
    Awaited<ReturnType<typeof load>> | null
  >(null);

  const [dataLoaded, setDataLoaded] =
    useState(false);

  // ==================================================
  // SESSION STATE
  // ==================================================

  const [companionState, setCompanionState] =
    useState<CompanionState>("idle");

  const [showDurationPicker, setShowDurationPicker] =
    useState(false);

  const [targetDurationSeconds, setTargetDurationSeconds] =
    useState(0);

  const [remainingSeconds, setRemainingSeconds] =
    useState(0);

  const [elapsedStudySeconds, setElapsedStudySeconds] =
    useState(0);

  const [completedSessionSeconds, setCompletedSessionSeconds] =
    useState(0);

  const [sessionStarted, setSessionStarted] =
    useState(false);

  const [customHours, setCustomHours] =
    useState("");

  const [customMinutes, setCustomMinutes] =
    useState("");

  // ==================================================
  // REFS
  // ==================================================

  const sessionSavedRef =
    useRef(false);

  const openingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  const closingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

  // ==================================================
  // LOAD PERSISTED DATA
  // ==================================================

  useEffect(() => {
    async function loadStudyData() {
      try {
        const studyStore =
          await load("pixel-study.json");

        const savedSetupComplete =
          await studyStore.get<boolean>(
            "setupComplete",
          );

        const savedSemester =
          await studyStore.get<string>(
            "semesterName",
          );

        const savedCourses =
          await studyStore.get<Course[]>(
            "courses",
          );

        const savedSessions =
          await studyStore.get<StudySession[]>(
            "sessions",
          );

        if (savedSetupComplete !== null) {
          setSetupComplete(
            savedSetupComplete ?? false,
          );
        }

        if (savedSemester) {
          setSemesterName(savedSemester);
        }

        if (
          savedCourses &&
          savedCourses.length > 0
        ) {
          setCourses(savedCourses);
        }

        if (savedSessions) {
          setSessions(savedSessions);
        }

        setStore(studyStore);
        setDataLoaded(true);
      } catch (error) {
        console.error(
          "Failed to load Pixel Study data:",
          error,
        );

        setDataLoaded(true);
      }
    }

    loadStudyData();
  }, []);

  // ==================================================
  // SAVE PERSISTED DATA
  // ==================================================

  useEffect(() => {
    if (!store || !dataLoaded) {
      return;
    }

    const currentStore = store;

    async function saveStudyData() {
      try {
        const data: PersistedData = {
          setupComplete,
          semesterName,
          courses,
          sessions,
        };

        await currentStore.set(
          "setupComplete",
          data.setupComplete,
        );

        await currentStore.set(
          "semesterName",
          data.semesterName,
        );

        await currentStore.set(
          "courses",
          data.courses,
        );

        await currentStore.set(
          "sessions",
          data.sessions,
        );

        await currentStore.save();
      } catch (error) {
        console.error(
          "Failed to save Pixel Study data:",
          error,
        );
      }
    }

    saveStudyData();
  }, [
    store,
    dataLoaded,
    setupComplete,
    semesterName,
    courses,
    sessions,
  ]);

  // ==================================================
  // CLEAN UP TIMERS
  // ==================================================

  useEffect(() => {
    return () => {
      if (openingTimeoutRef.current) {
        clearTimeout(
          openingTimeoutRef.current,
        );
      }

      if (closingTimeoutRef.current) {
        clearTimeout(
          closingTimeoutRef.current,
        );
      }
    };
  }, []);

  // ==================================================
  // PRELOAD SCENES
  // ==================================================

  useEffect(() => {
    allSceneSources.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  // ==================================================
  // COURSE MANAGEMENT
  // ==================================================

  function addCourse() {
    const code = newCode.trim();
    const name = newCourseName.trim();

    if (!code || !name) {
      return;
    }

    const newCourse: Course = {
      id: Date.now(),
      code: code.toUpperCase(),
      name,
    };

    setCourses((previousCourses) => [
      ...previousCourses,
      newCourse,
    ]);

    setNewCode("");
    setNewCourseName("");
  }

  function removeCourse(id: number) {
    setCourses((previousCourses) =>
      previousCourses.filter(
        (course) => course.id !== id,
      ),
    );

    if (selectedCourse?.id === id) {
      setSelectedCourse(null);
    }
  }

  function handleContinue() {
    if (courses.length === 0) {
      return;
    }

    setSetupComplete(true);
  }

  // ==================================================
  // FORMATTING
  // ==================================================

  function formatTimer(totalSeconds: number) {
    const safeSeconds = Math.max(
      0,
      Math.floor(totalSeconds),
    );

    const hours = Math.floor(
      safeSeconds / 3600,
    );

    const minutes = Math.floor(
      (safeSeconds % 3600) / 60,
    );

    const seconds = safeSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  }

  function formatDuration(totalSeconds: number) {
    const safeSeconds = Math.max(
      0,
      Math.floor(totalSeconds),
    );

    const hours = Math.floor(
      safeSeconds / 3600,
    );

    const minutes = Math.floor(
      (safeSeconds % 3600) / 60,
    );

    const seconds = safeSeconds % 60;

    if (hours > 0) {
      if (minutes > 0) {
        return `${hours}h ${minutes}m`;
      }

      return `${hours}h`;
    }

    if (minutes > 0) {
      if (seconds > 0) {
        return `${minutes}m ${seconds}s`;
      }

      return `${minutes}m`;
    }

    return `${seconds}s`;
  }

  // ==================================================
  // STUDY TIMER
  // ==================================================

  useEffect(() => {
    if (
      companionState !== "studying" ||
      !sessionStarted
    ) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          return 0;
        }

        return current - 1;
      });

      setElapsedStudySeconds(
        (current) => current + 1,
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    companionState,
    sessionStarted,
  ]);

  // ==================================================
  // AUTOMATIC COMPLETION
  // ==================================================

  useEffect(() => {
    if (
      companionState === "studying" &&
      sessionStarted &&
      remainingSeconds === 0 &&
      targetDurationSeconds > 0
    ) {
      completeSession();
    }
  }, [
    remainingSeconds,
    companionState,
    sessionStarted,
    targetDurationSeconds,
  ]);

  // ==================================================
  // DURATION PICKER
  // ==================================================

  function openDurationPicker() {
    if (!selectedCourse) {
      return;
    }

    setShowDurationPicker(true);
  }

  function selectDuration(
    seconds: number,
  ) {
    setTargetDurationSeconds(
      seconds,
    );
  }

  function selectCustomDuration() {
    const hours = Math.max(
      0,
      Math.min(
        23,
        Number(customHours) || 0,
      ),
    );

    const minutes = Math.max(
      0,
      Math.min(
        59,
        Number(customMinutes) || 0,
      ),
    );

    const totalSeconds =
      hours * 3600 +
      minutes * 60;

    if (totalSeconds <= 0) {
      return;
    }

    setTargetDurationSeconds(
      totalSeconds,
    );
  }

  // ==================================================
  // BEGIN SESSION
  // ==================================================

  function beginSession() {
    if (
      !selectedCourse ||
      targetDurationSeconds <= 0
    ) {
      return;
    }

    /*
     * Lock the selected course to this session.
     * This prevents the course from becoming
     * undefined while the session is running.
     */
    setActiveCourse(selectedCourse);

    if (openingTimeoutRef.current) {
      clearTimeout(
        openingTimeoutRef.current,
      );
    }

    if (closingTimeoutRef.current) {
      clearTimeout(
        closingTimeoutRef.current,
      );
    }

    setRemainingSeconds(
      targetDurationSeconds,
    );

    setElapsedStudySeconds(0);

    setCompletedSessionSeconds(0);

    setSessionStarted(false);

    sessionSavedRef.current = false;

    setShowDurationPicker(false);

    setCompanionState("opening");

    openingTimeoutRef.current = setTimeout(() => {
      setSessionStarted(true);
      setCompanionState("studying");
    }, openingMs);
  }

  // ==================================================
  // PAUSE / RESUME
  // ==================================================

  function pauseStudying() {
    if (
      companionState !== "studying"
    ) {
      return;
    }

    setCompanionState("paused");
  }

  function resumeStudying() {
    if (
      companionState !== "paused"
    ) {
      return;
    }

    setCompanionState("studying");
  }

  // ==================================================
  // SAVE SESSION
  // ==================================================

  function saveSession(
    actualSeconds: number,
  ) {
    if (!activeCourse) {
      return;
    }

    if (sessionSavedRef.current) {
      return;
    }

    const safeSeconds = Math.max(
      0,
      Math.floor(actualSeconds),
    );

    if (safeSeconds < 1) {
      return;
    }

    sessionSavedRef.current = true;

    const newSession: StudySession = {
      id: Date.now(),
      courseId: activeCourse.id,
      duration: safeSeconds,
      date: new Date().toISOString(),
    };

    setSessions((previousSessions) => [
      ...previousSessions,
      newSession,
    ]);
  }

  // ==================================================
  // CLOSING SEQUENCE
  // ==================================================

  function startClosingSequence(
    actualSeconds: number,
  ) {
    if (!activeCourse) {
      return;
    }

    setCompletedSessionSeconds(
      actualSeconds,
    );

    saveSession(actualSeconds);

    setSessionStarted(false);

    setCompanionState("closing");

    if (closingTimeoutRef.current) {
      clearTimeout(
        closingTimeoutRef.current,
      );
    }

    closingTimeoutRef.current = setTimeout(() => {
      setCompanionState("complete");
    }, closingMs);
  }

  function completeSession() {
    if (
      !activeCourse ||
      targetDurationSeconds <= 0 ||
      !sessionStarted
    ) {
      return;
    }

    const actualSeconds =
      elapsedStudySeconds;

    if (actualSeconds < 1) {
      return;
    }

    startClosingSequence(
      actualSeconds,
    );
  }

  function finishStudying() {
    if (
      !activeCourse ||
      targetDurationSeconds <= 0 ||
      !sessionStarted
    ) {
      return;
    }

    const actualSeconds =
      elapsedStudySeconds;

    if (actualSeconds < 1) {
      resetSession();
      return;
    }

    startClosingSequence(
      actualSeconds,
    );
  }

  // ==================================================
  // RESET SESSION
  // ==================================================

  function resetSession() {
    if (openingTimeoutRef.current) {
      clearTimeout(
        openingTimeoutRef.current,
      );

      openingTimeoutRef.current = null;
    }

    if (closingTimeoutRef.current) {
      clearTimeout(
        closingTimeoutRef.current,
      );

      closingTimeoutRef.current = null;
    }

    setCompanionState("idle");

    setTargetDurationSeconds(0);

    setRemainingSeconds(0);

    setElapsedStudySeconds(0);

    setCompletedSessionSeconds(0);

    setSessionStarted(false);

    setShowDurationPicker(false);

    setCustomHours("");

    setCustomMinutes("");

    sessionSavedRef.current = false;
  }

  // ==================================================
  // EXIT ACTIVE SESSION
  // ==================================================

  function exitSession() {
    /*
     * This is intentionally separate from resetSession().
     * It clears both the temporary session state and
     * the course locked to the active session.
     */

    resetSession();

    setActiveCourse(null);
    setSelectedCourse(null);
  }

  // ==================================================
  // RETURN TO DASHBOARD
  // ==================================================

  function returnToDashboard() {
    resetSession();

    setActiveCourse(null);
  }

  // ==================================================
  // RESET ALL DATA
  // ==================================================

  async function resetStudyData() {
    const confirmed =
      window.confirm(
        "Reset all Pixel Study data?\n\nThis will permanently delete your saved courses and study history.",
      );

    if (!confirmed) {
      return;
    }

    try {
      if (store) {
        await store.clear();
        await store.save();
      }

      setSetupComplete(false);

      setSemesterName(
        "2026 Semester 1",
      );

      setCourses(initialCourses);

      setSessions([]);

      setSelectedCourse(null);

      setActiveCourse(null);

      resetSession();
    } catch (error) {
      console.error(
        "Failed to reset Pixel Study data:",
        error,
      );
    }
  }

  // ==================================================
  // STATS
  // ==================================================

  function getCourseStudyTime(
    courseId: number,
  ) {
    const totalSeconds = sessions
      .filter(
        (session) =>
          session.courseId === courseId,
      )
      .reduce(
        (total, session) =>
          total + session.duration,
        0,
      );

    return formatDuration(
      totalSeconds,
    );
  }

  function getStudyStreak() {
    if (sessions.length === 0) {
      return 0;
    }

    const studiedDates = new Set(
      sessions.map((session) => {
        const date = new Date(
          session.date,
        );

        return [
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        ].join("-");
      }),
    );

    const today = new Date();

    let streak = 0;

    const currentDate = new Date(
      today,
    );

    while (true) {
      const dateKey = [
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      ].join("-");

      if (!studiedDates.has(dateKey)) {
        break;
      }

      streak += 1;

      currentDate.setDate(
        currentDate.getDate() - 1,
      );
    }

    return streak;
  }

  function isToday(
    dateString: string,
  ) {
    const date = new Date(
      dateString,
    );

    const today = new Date();

    return (
      date.getFullYear() ===
        today.getFullYear() &&
      date.getMonth() ===
        today.getMonth() &&
      date.getDate() ===
        today.getDate()
    );
  }

  function isWithinLast7Days(
    dateString: string,
  ) {
    const date = new Date(
      dateString,
    );

    const now = new Date();

    const difference =
      now.getTime() -
      date.getTime();

    const sevenDays =
      7 * 24 * 60 * 60 * 1000;

    return (
      difference >= 0 &&
      difference < sevenDays
    );
  }

  function getTodayStudyTime() {
    const totalSeconds = sessions
      .filter((session) =>
        isToday(session.date),
      )
      .reduce(
        (total, session) =>
          total + session.duration,
        0,
      );

    return formatDuration(
      totalSeconds,
    );
  }

  function getWeeklyStudyTime() {
    const totalSeconds = sessions
      .filter((session) =>
        isWithinLast7Days(
          session.date,
        ),
      )
      .reduce(
        (total, session) =>
          total + session.duration,
        0,
      );

    return formatDuration(
      totalSeconds,
    );
  }

  // ==================================================
  // SETUP SCREEN
  // ==================================================

  if (!setupComplete) {
    return (
      <main className="setup-page">
        <section className="setup-card">
          <div className="brand">
            <span className="brand-star">
              ✦
            </span>

            <h1>PIXEL STUDY</h1>

            <span className="brand-star">
              ✦
            </span>
          </div>

          <p className="subtitle">
            Your tiny study companion.
          </p>

          <div className="form-section">
            <label htmlFor="semester">
              Semester
            </label>

            <input
              id="semester"
              type="text"
              value={semesterName}
              onChange={(event) =>
                setSemesterName(
                  event.target.value,
                )
              }
              placeholder="2026 Semester 1"
            />
          </div>

          <div className="form-section">
            <div className="section-heading">
              <label>
                Your courses
              </label>

              <span>
                {courses.length} course
                {courses.length === 1
                  ? ""
                  : "s"}
              </span>
            </div>

            <div className="course-list">
              {courses.map((course) => (
                <div
                  className="course-item"
                  key={course.id}
                >
                  <div>
                    <span className="course-code">
                      {course.code}
                    </span>

                    <span className="course-name">
                      {course.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeCourse(
                        course.id,
                      )
                    }
                    aria-label={`Remove ${course.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="add-course">
            <input
              type="text"
              value={newCode}
              onChange={(event) =>
                setNewCode(
                  event.target.value,
                )
              }
              placeholder="CODE"
              aria-label="Course code"
            />

            <input
              type="text"
              value={newCourseName}
              onChange={(event) =>
                setNewCourseName(
                  event.target.value,
                )
              }
              placeholder="Course name"
              aria-label="Course name"
            />

            <button
              type="button"
              onClick={addCourse}
              aria-label="Add course"
            >
              +
            </button>
          </div>

          <button
            className="continue-button"
            type="button"
            disabled={
              courses.length === 0
            }
            onClick={handleContinue}
          >
            Continue →
          </button>
        </section>
      </main>
    );
  }

  // ==================================================
  // OPENING SEQUENCE (full-screen scene)
  // ==================================================

  if (
    companionState === "opening"
  ) {
    return (
      <main className="scene-page">
        <img
          className="scene-fullscreen"
          src={scenes.opening}
          alt=""
        />
      </main>
    );
  }

  // ==================================================
  // CLOSING SEQUENCE (full-screen scene)
  // ==================================================

  if (
    companionState === "closing"
  ) {
    return (
      <main className="scene-page">
        <img
          className="scene-fullscreen"
          src={scenes.closing}
          alt=""
        />
      </main>
    );
  }

  // ==================================================
  // COMPLETION SCREEN
  // ==================================================

  if (
    companionState === "complete"
  ) {
    return (
      <main className="session-page">
        <div className="scene-box">
          <img
            className="scene-frame"
            src={scenes.complete}
            alt=""
          />
        </div>

        <span className="eyebrow">
          ✦ SESSION COMPLETE
        </span>

        <h1>
          You did the work.
          <br />
          Good job.
        </h1>

        <div className="completed-time">
          {formatDuration(
            completedSessionSeconds,
          )}
        </div>

        <p className="completion-message">
          You studied{" "}
          <strong>
            {activeCourse?.code ??
              "your course"}
          </strong>{" "}
          for{" "}
          <strong>
            {formatDuration(
              completedSessionSeconds,
            )}
          </strong>
          .
        </p>

        <button
          className="start-button"
          type="button"
          onClick={
            returnToDashboard
          }
        >
          Back to dashboard →
        </button>
      </main>
    );
  }

  // ==================================================
  // ACTIVE STUDY SESSION
  // ==================================================

  if (
    companionState === "studying" ||
    companionState === "paused"
  ) {
    const isPaused =
      companionState === "paused";

    return (
      <main className="study-session-page">
        <header className="study-session-header">
          <div>
            <span className="eyebrow">
              ✦{" "}
              {activeCourse?.code ??
                "STUDY SESSION"}
            </span>

            <h1>
              {activeCourse?.name ??
                "Study Session"}
            </h1>
          </div>

          <button
            type="button"
            className="settings-button"
            onClick={exitSession}
          >
            Exit
          </button>
        </header>

        <section className="active-session-card has-scene">
          <div className="scene-box">
            <img
              className="scene-frame"
              src={
                isPaused
                  ? scenes.paused
                  : scenes.studying
              }
              alt=""
            />
          </div>

          <div className="active-session-content">
            <span className="eyebrow">
              {isPaused
                ? "PAUSED"
                : "FOCUS TIME"}
            </span>

            <div className="timer">
              {formatTimer(
                remainingSeconds,
              )}
            </div>

            <p>
              {isPaused
                ? "Take a short break. Resume when you're ready."
                : `Studying ${
                    activeCourse?.code ??
                    ""
                  }`}
            </p>

            <div className="session-actions">
              {isPaused ? (
                <button
                  type="button"
                  className="start-button"
                  onClick={
                    resumeStudying
                  }
                >
                  Resume →
                </button>
              ) : (
                <button
                  type="button"
                  className="start-button"
                  onClick={
                    pauseStudying
                  }
                >
                  Pause
                </button>
              )}

              <button
                type="button"
                className="finish-button"
                onClick={
                  finishStudying
                }
              >
                Finish session
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ==================================================
  // DURATION PICKER
  // ==================================================

  if (showDurationPicker) {
    return (
      <main className="duration-page">
        <header className="duration-header">
          <button
            type="button"
            className="back-button"
            onClick={() =>
              setShowDurationPicker(
                false,
              )
            }
          >
            ← Back
          </button>

          <div>
            <span className="eyebrow">
              ✦{" "}
              {selectedCourse?.code}
            </span>

            <h1>
              How long are we studying?
            </h1>
          </div>
        </header>

        <div className="duration-body">
          <div className="duration-character has-scene">
            <img
              className="scene-frame"
              src={scenes.dashboard}
              alt=""
            />
          </div>

          <div className="duration-options">
            {durationOptions.map(
              (option) => (
                <button
                  key={option.seconds}
                  type="button"
                  className={
                    targetDurationSeconds ===
                    option.seconds
                      ? "duration-option selected"
                      : "duration-option"
                  }
                  onClick={() =>
                    selectDuration(
                      option.seconds,
                    )
                  }
                >
                  {option.label}
                </button>
              ),
            )}
          </div>

          <div className="custom-duration">
            <span>
              Custom duration
            </span>

            <div className="custom-inputs">
              <input
                type="number"
                min="0"
                max="23"
                value={customHours}
                onChange={(event) =>
                  setCustomHours(
                    event.target.value,
                  )
                }
                placeholder="HH"
                aria-label="Hours"
              />

              <span>:</span>

              <input
                type="number"
                min="0"
                max="59"
                value={customMinutes}
                onChange={(event) =>
                  setCustomMinutes(
                    event.target.value,
                  )
                }
                placeholder="MM"
                aria-label="Minutes"
              />

              <button
                type="button"
                onClick={
                  selectCustomDuration
                }
              >
                Set
              </button>
            </div>
          </div>

          <button
            type="button"
            className="start-session-button"
            disabled={
              targetDurationSeconds <= 0
            }
            onClick={beginSession}
          >
            Start session →
          </button>
        </div>
      </main>
    );
  }

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow">
            ✦ {semesterName}
          </span>

          <h1>
            Ready to study?
          </h1>
        </div>

        <button
          type="button"
          className="settings-button"
          onClick={() =>
            setSetupComplete(false)
          }
        >
          Settings
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>⏱</span>

          <div>
            <strong>
              {getTodayStudyTime()}
            </strong>

            <small>today</small>
          </div>
        </div>

        <div className="stat-card">
          <span>📚</span>

          <div>
            <strong>
              {getWeeklyStudyTime()}
            </strong>

            <small>
              this week
            </small>
          </div>
        </div>

        <div className="stat-card">
          <span>🔥</span>

          <div>
            <strong>
              {getStudyStreak()}
            </strong>

            <small>
              day streak
            </small>
          </div>
        </div>
      </section>

      <section className="study-section">
        <div className="section-title">
          <span className="eyebrow">
            STUDY
          </span>

          <h2>
            Pick a course
          </h2>
        </div>

        <div className="dashboard-courses">
          {courses.map((course) => (
            <button
              key={course.id}
              type="button"
              className={
                selectedCourse?.id ===
                course.id
                  ? "dashboard-course selected"
                  : "dashboard-course"
              }
              onClick={() =>
                setSelectedCourse(
                  course,
                )
              }
            >
              <span className="dashboard-course-code">
                {course.code}
              </span>

              <strong>
                {course.name}
              </strong>

              <span className="course-time">
                {getCourseStudyTime(
                  course.id,
                )}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="companion-card">
        <div className="companion-placeholder has-scene">
          <img
            className="scene-frame"
            src={scenes.dashboard}
            alt=""
          />
        </div>

        <div className="companion-info">
          <span className="eyebrow">
            YOUR COMPANION
          </span>

          <h2>
            {selectedCourse
              ? `Ready for ${selectedCourse.code}?`
              : "Pick a course to begin."}
          </h2>

          <p>
            {selectedCourse
              ? "Let's get some focused work done."
              : "Your tiny study buddy is waiting."}
          </p>

          <button
            className="start-button"
            type="button"
            disabled={!selectedCourse}
            onClick={
              openDurationPicker
            }
          >
            Start a session →
          </button>
        </div>
      </section>

      <button
        type="button"
        className="reset-data-button"
        onClick={
          resetStudyData
        }
      >
        Reset Study Data
      </button>
    </main>
  );
}

export default App;