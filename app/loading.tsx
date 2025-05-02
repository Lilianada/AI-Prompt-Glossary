import FancyLoader from "@/components/fancy-loader"

export default function Loading() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <FancyLoader size="lg" />
    </div>
  )
}
