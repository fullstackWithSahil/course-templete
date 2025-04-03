import React from 'react'

export default function NoCourses({text}:{text:string}) {
  return (
    <div className="h-[35vh] dark:bg-gray-900 text-2xl flex items-center justify-center dark:text-white my-24 mx-5 border-2 dark:border-white rounded-xl">
      <p className="text-center">{text}</p>
    </div>
  )
}
