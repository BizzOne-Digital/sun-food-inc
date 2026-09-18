export default function Loading() {
  return (
    <div className="container-page py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-soft-bg rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
