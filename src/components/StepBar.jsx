// 關卡內的步驟進度條
export default function StepBar({ current, total, doneUntil = -1 }) {
  return (
    <div className="flex gap-1.5 my-5 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        let bg = "bg-surface2 border border-line";
        if (i <= doneUntil) bg = "bg-mint border-transparent";
        else if (i === current) bg = "border-transparent bg-gradient-to-r from-primary to-accent";
        return <div key={i} className={`flex-1 min-w-[60px] h-2 rounded-full ${bg}`} />;
      })}
    </div>
  );
}
