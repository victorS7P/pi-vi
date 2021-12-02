import './TitledBox.scss'

export function TitledBoxComponent ({ title, children, className }) {
  return (
    <div className={`${className || ''} box`}>
      <div className="title">
        {title}
      </div>

      {children}
    </div>
  )
}
