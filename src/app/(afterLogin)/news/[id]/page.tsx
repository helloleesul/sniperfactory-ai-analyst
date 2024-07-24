import { StockInfo } from "@/components/Report/type/report/stockType";
import NewsDetail from "./_components/NewsDetail";
import RelatedList from "./_components/RelatedList";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";
import { BASE_URL } from "@/constants";

type NewsDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const id = params.id;
  const article = await (await fetch(`${BASE_URL}/api/news/${id}`)).json();
  const { relatedStocks } = article;
  const stockList: StockInfo[] = [];

  if (relatedStocks.length > 0) {
    const stocksRef = collection(firestore, "stockList");
    const q = query(stocksRef, where("ticker", "in", relatedStocks));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      stockList.push(doc.data() as StockInfo);
    });
  }

  return (
    <>
      <div className="px-[120px] pt-10 pb-[70px] overflow-hidden flex gap-5 justify-center">
        <NewsDetail id={id} />
        <RelatedList stockList={stockList} />
      </div>
    </>
  );
}
