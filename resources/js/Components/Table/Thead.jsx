const Thead = ({children}) => {
  return (
     <thead className="sticky top-0 z-50 before:absolute before:bottom-0 before:left-0  before:h-[0.1px] before:w-full before:bg-secondary">{children}</thead>
  )
}
export default Thead
