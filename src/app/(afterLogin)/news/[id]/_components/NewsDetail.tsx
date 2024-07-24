import Image from "next/image";

import HeadingFont from "@/common/HeadingFont";
import ListWrap from "@/common/ListWrap";
import TextButton from "@/common/TextButton";
import IconButton from "@/common/IconButton";
import { getFormattedDate } from "@/service/news/setTimestampToDate";

import TranslateIcon from "../../../../../../public/images/Translate_icon.svg";
import AiIcon from "../../../../../../public/images/logo/LOGO.svg";
import { BASE_URL } from "@/constants";

export type NewsDetailProps = {
  id: string;
};

export default async function NewsDetail({ id }: NewsDetailProps) {
  const article = await (await fetch(`${BASE_URL}api/news/${id}`)).json();

  const { contents } = article;
  const sentences = contents.split("다.");

  return (
    <>
      {article && (
        <ListWrap width="792px" height="auto" padding="md">
          <HeadingFont level="4" weight="bold">
            {article.headLine}
          </HeadingFont>
          <div className="flex justify-between mt-4">
            <aside className="flex gap-[6px] before:content-['∙'] before:order-2">
              <span className="text-[14px] text-grayscale-600 font-medium order-1">{article.media}</span>
              <span className="text-[14px] text-grayscale-600 font-medium order-3">
                {getFormattedDate(article.creationTime)}
              </span>
            </aside>
            {/* <div className="w-[176px]">
              <TextButton variant="primary" size="sm">
                <TranslateIcon fill="#fff" className="inline-block mr-[2px]" />
                번역하기
              </TextButton>
            </div> */}
          </div>
          <section className="my-8">
            <div className="flex gap-3 mb-6">
              <IconButton color="primary" size="xs" round="md">
                <AiIcon width="14" height="14" />
              </IconButton>
              <h5 className="text-4 font-semibold">아잇나우 AI요약</h5>
            </div>
            <p>바이오 연구의 첨단,인공 유전자로 인간 피부 재생 가능성</p>
          </section>
          <article>
            <div className="rounded-[10px] overflow-hidden mb-6">
              <Image src={article.image} width={728} height={320} className="h-auto" priority alt={""} />
            </div>
            <div className="leading-[26px] flex flex-col gap-4 whitespace-pre-line">
              {sentences.map((item: any, index: number, array: []) => (
                <p key={index}>{index === array.length - 1 ? item : `${item}다.`}</p>
              ))}
            </div>
          </article>
        </ListWrap>
      )}
    </>
  );
}
