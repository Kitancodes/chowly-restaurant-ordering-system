function ComplaintModal({ show, rating, onRatingChange, complaintText, onComplaintChange, onCancel, onSubmit }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0D0D0D] p-6">
        <h3 className="mb-4 text-lg font-medium">Rate your experience</h3>

        <div className="mb-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRatingChange(star)}
              className={`text-3xl transition-all ${star <= rating ? "text-amber-400" : "text-white/20"}`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={complaintText}
          onChange={(e) => onComplaintChange(e.target.value)}
          placeholder="Tell us what went wrong (optional)..."
          className="mb-6 h-28 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-amber-500"
        />

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-white/20 py-2.5 text-sm">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-black hover:bg-amber-400"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintModal;