import { useState } from "react"
import { APP } from "src/config"
import { clearSlot, initPage } from "src/store/slices/page"
import { useAppDispatch } from "./storeHooks"



export const usePage = (page? :string ) => {
    const dispatch = useAppDispatch()
    const namePage = page ? page:''
    const [pageName] = useState(APP.NOMBRE +' - '+ namePage.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()))


    const init = () => {
        dispatch(clearSlot())
        dispatch(initPage(pageName))        
    }




  return {
    init,
    dispatch,
    pageName

  }
}
