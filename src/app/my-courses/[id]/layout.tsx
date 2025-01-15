import Content from "./Content";
import Description from "./Description";
import Comments from "./Comments";
import { ReactNode } from "react";
import ContextProvider from "./Context";


export default function Layout({children}:{children:ReactNode}) {
  return (
    <ContextProvider>
      <main className="mt-16 md:relative">
        <section className="mx-2 w-full md:w-2/3 md:absolute top-0 left-0">
          <div>
            {children}
          </div>
          <div className="flex items-center justify-between my-2">
            <h1 className="text-xl mx-2">Basics of HTML</h1>
            <h1 className="text-xl mx-2">11/12/2024</h1>
          </div>
          <Description/>
          <Comments/>
        </section>
        <Content/>
      </main>
    </ContextProvider>
  );
}
