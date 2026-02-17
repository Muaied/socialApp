import React, { useCallback, useMemo, useState } from 'react'
import Child from '../Child/Child';
import AppButton from '../../Shared/AppButton/AppButton';

const usersData = [
        {name: "Ehab", age: 20},
        {name: "Sayed", age: 22},
        {name: "Ali", age: 2},
        {name: "Bebo", age: 20},
    ]

    
export default function Parent() {
    const [count, setCount] = useState(0)
    console.log("Render From Parent Component");

    // function getName(data) {
    //     console.log(getName.name)
    // }

    const [isFound, setIsFound] = useState(false);

    // 19
    
    const test = useCallback(function(){
        console.log(getName.name)
    }, [])
    
    let x 
    useMemo(()=> {
         x = (usersData.filter(e => e.name === 'Ali'))
        console.log("Found") // complex  

    }, [isFound])
    
  return (
    <div className='space-y-5'>
   <div>Parent</div>
   counter: {count}
   <AppButton color="warning" variant="shadow" onClick={function(){setCount(count + 1)}}>Increment</AppButton>
    {usersData.map((e,index) => <Child key={index} user={e}getName={test}/>)} 
    <AppButton color="danger" variant="shadow" onClick={function(){setIsFound(x)}}>Find</AppButton>
    </div>
  )
}
