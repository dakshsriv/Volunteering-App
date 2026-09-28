"use client";

import { useState } from "react";

const GOAL = 40;

export function HoursCalculator() {
  const [completed, setCompleted] = useState(0);
  const [weekly, setWeekly] = useState(2);

  const percentage = Math.min((completed / GOAL) * 100, 100);
  const remaining = Math.max(GOAL - completed, 0);
  const weeksLeft = weekly > 0 ? Math.ceil(remaining / weekly) : null;

  return (
    <div className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-[0_20px_60px_rgba(91,140,255,0.14)] backdrop-blur sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900">
        Graduation Hour Tracker
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Drag to see your progress toward the {GOAL}-hour goal.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
            <label htmlFor="completed-hours">Completed hours</label>
            <span>{completed} hrs</span>
          </div>
          <input
            id="completed-hours"
            type="range"
            min={0}
            max={60}
            value={completed}
            onChange={(e) => setCompleted(Number(e.target.value))}
            className="mt-2 w-full accent-sky-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
            <label htmlFor="weekly-hours">Hours per week</label>
            <span>{weekly} hrs</span>
          </div>
          <input
            id="weekly-hours"
            type="range"
            min={1}
            max={10}
            value={weekly}
            onChange={(e) => setWeekly(Number(e.target.value))}
            className="mt-2 w-full accent-sky-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-sky-100">
            <div
              className="h-full rounded-full bg-sky-600 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="text-center text-sm font-medium text-slate-700">
          {completed >= GOAL ? (
            <span className="text-green-600">
              Goal reached! Great work.
            </span>
          ) : (
            <>
              {remaining} hours remaining
              {weeksLeft !== null && (
                <span className="text-slate-500">
                  {" "}
                  — about {weeksLeft} week{weeksLeft === 1 ? "" : "s"} at{" "}
                  {weekly} hrs/week
                </span>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
