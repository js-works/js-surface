import { h, component, useEffect, useState } from '../../main/index'

const Clock = component({
  name: 'Clock',

  main() {
    const
      [time, setTime] = useState(() => new Date().toLocaleTimeString())
  
    useEffect(() => {
      const id =
        setInterval(
          () => setTime(new Date().toLocaleTimeString()),
          100)

      return () => clearInterval(id)
    }, [])

    return (
      <div>
        Time: {time}
      </div>
    )
  }
})

export default <Clock/>
