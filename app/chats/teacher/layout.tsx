import { ReactNode } from "react";
import MessagesProvider from "./context";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <MessagesProvider>
        {children}
    </MessagesProvider>
  );
}