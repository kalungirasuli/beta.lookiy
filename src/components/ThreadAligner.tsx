function  ThreadAligner({children,isOwn}){
  return (
    <div className={`children mt-2 ${isOwn ? 'mr-[10%]' : 'ml-[10%]'}`}>
        {
          children && children.length>0 && (
            children.map((child,indx)=>(
              <MessageBubble {...child} key={indx} />
            ))
            
          )
        }
       </div>
  )
}
