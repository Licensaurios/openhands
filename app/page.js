import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
export default async function Home() {
  const { userId } = await auth()

  redirect('/landing')
//  if (userId) {
//    //redirect('/user')
//  } else {
//    redirect('/landing')
//  }
}