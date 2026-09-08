import { translations } from "../../data/translations";
import { IconHelper } from "../common/IconHelper";
import { CheckCircle2, Clock, Play, ArrowLeft } from "lucide-react";
export const PatientTasks = ({
  tasks,
  profile,
  onStartTask,
  onBack
}) => {
  const t = translations[profile.language];
  const completedCount = tasks.filter((t2) => t2.status === "completed").length;
  const totalCount = tasks.length;
  return <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24 animate-in fade-in duration-200">
      
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <button
    onClick={onBack}
    className="flex items-center gap-1.5 text-slate-700 hover:text-[#0D7377] font-bold text-sm sm:text-base py-1.5 px-3 rounded-xl bg-white border border-slate-200 shadow-2xs transition"
  >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <span className="text-xs sm:text-sm font-bold text-[#0D7377] bg-[#EAF6F4] px-3 py-1 rounded-full border border-[#0D7377]/20">
          Doctor Assigned Routine
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#0D7377]/15">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#132A2F] font-display mb-2">
          Today's Tasks
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium mb-4">
          Complete your doctor-recommended exercises at your own gentle pace.
        </p>

        {
    /* Large Progress Bar */
  }
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
            <span>Progress</span>
            <span className="text-[#0D7377]">{completedCount} / {totalCount} completed</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200">
            <div
    className="bg-[#0D7377] h-full rounded-full transition-all duration-500"
    style={{ width: `${completedCount / totalCount * 100}%` }}
  />
          </div>
        </div>
      </div>

      {
    /* Vertical Large Cards (Frame 02 Specification) */
  }
      <div className="space-y-4">
        {tasks.map((task) => {
    const isDone = task.status === "completed";
    return <div
      key={task.id}
      className={`rounded-3xl p-6 transition-all border ${isDone ? "bg-emerald-50/80 border-emerald-300" : "bg-white border-[#0D7377]/20 shadow-sm"}`}
    >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-200 text-emerald-800" : "bg-[#E8F6F4] text-[#0D7377]"}`}
    >
                    <IconHelper name={task.iconName} className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-[#0D7377] bg-[#E8F6F4] px-2.5 py-0.5 rounded-full border border-[#0D7377]/20">
                        {task.domain}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {task.difficulty}
                      </span>
                      {task.doctorAssigned && <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                          Doctor assigned
                        </span>}
                    </div>
                    <h3 className="text-xl font-black text-[#132A2F]">
                      {task.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-slate-500 shrink-0">
                  <Clock className="w-4 h-4" />
                  <span>{task.durationMinutes} min</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 font-medium mb-5">
                {task.description}
              </p>

              {
      /* Action Area */
    }
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                {isDone ? <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span>COMPLETED · {task.score || 92}%</span>
                  </div> : <span className="text-xs font-semibold text-slate-500">
                    Ready to start
                  </span>}

                <button
      onClick={() => onStartTask(task)}
      className={`px-7 py-3.5 rounded-2xl font-black text-base transition active:scale-95 flex items-center gap-2.5 cursor-pointer ${isDone ? "bg-slate-100 hover:bg-slate-200 text-slate-700" : "btn-glow-teal bg-[#0D7377] hover:bg-[#0A5C5F] text-white shadow-lg"}`}
    >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{isDone ? "PLAY AGAIN" : "START TASK"}</span>
                </button>
              </div>
            </div>;
  })}
      </div>

    </div>;
};
