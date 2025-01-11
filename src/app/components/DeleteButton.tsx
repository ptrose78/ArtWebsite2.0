'use client'

export function DeleteButton(){
    return (
        <button className="mr-2 bg-red-600 hover:bg-red-700 rounded-lg pl-1 pr-1 text-white text-lg" 
            onClick={()=>handleDelete(post)}>
            X
        </button>
    )
}