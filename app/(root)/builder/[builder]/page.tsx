
// import { createClient } from "@/supabase/server"
import { fetchBuilderById } from "./builderactions";

interface BuildDetailPageProps {
  params: { builder: string }
  searchParams: { tab?: string; comment?: string }
}

export default async function BuilderDetailPage({ params, searchParams }: BuildDetailPageProps) {
  const builder = await fetchBuilderById(params.builder)
  const builderfirst = builder?.shift()
  console.log("this is Builder First Data:",builderfirst)
  const builderdescription = builderfirst?.description
  const buildername = builderfirst?.name
  console.log(searchParams)
   
  
  //console.log(params)

  // Fix: await createClient() without arguments and then access auth
  // const supabase = await createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()
  // //console.log("This is the user Info",user)

  return (
    <div className="p-4">
      <p>builder</p>
      <p>{builderdescription}</p>
      <p>{buildername}</p>
    </div>
  )

  
}
