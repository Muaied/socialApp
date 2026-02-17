import React from 'react'

 function Child({user}) {
     console.log("Render From Child Component")
  return (
    <>
    <div className='bg-red-400 p-9 rounded-4xl'>
        <h1>Name: {user.name}</h1>
        <h1>Age: {user.age}</h1>
    </div>
    </>
  )
}

const ChildMemo = React.memo(Child, function(prevProps, nextProps) {
    return prevProps.name === nextProps.name    
})


export default ChildMemo