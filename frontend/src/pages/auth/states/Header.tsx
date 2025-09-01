import HighlightedText from "../../../components/HighlightedText";

export default function HeadSection() {
  return (
    <section className="bg-content2 top-0 left-0  rounded-t-4xl sticky pt-10 md:pt-0 h-50 md:h-68 flex flex-col items-center">
      <div className="absolute opacity-20 top-0 left-0 w-full h-full  bg-tile"></div>

      <div className="text-center z-1 md:gap-2 px-10 flex flex-1 flex-col mb-16 items-center justify-center">
        <HighlightedText>
          <h1 className="font-semibold text-md lg:text-2xl">
            انتخاب رشته،رشته های دفترچه بدون آزمون و رشته های دفترچه با آزمون
            ۱۴۰۴
          </h1>
        </HighlightedText>

        <HighlightedText>
          <h2>اول رایگان بهت میگم هر رشته ای چند درصد احتمال قبولی داری!</h2>
        </HighlightedText>

        <HighlightedText >
          <h2>بعد برات انتخاب رشته میکنم!</h2>
        </HighlightedText>
      </div>
      <svg
        className="absolute text-content1 bottom-0 left-0 w-full h-2 lg:h-6"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentcolor"
          d="M0,320 C720,0 720,0 1440,320 L1440,320 L0,320 Z"
        ></path>
      </svg>
    </section>
  );
}
