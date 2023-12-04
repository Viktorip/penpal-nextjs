import { robotoMediumFont } from "@/app/fonts";

export default function PageContainer({children}) {

    return (
        <div className={`p-10 h-screen w-full bg-green-200 ${robotoMediumFont.className}`}>{children}</div>
    )
}