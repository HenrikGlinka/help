export default function ToggleButton({ checked = null, on = null, off = null, disabled = null, id=null}) {

    function changeHandler(event) {
        const isChecked = event.target.checked;

        if (isChecked && on !== null) on();
        else if (!isChecked && off !== null) off();
    }

    return (
        <>
            <input id={id} onChange={changeHandler} defaultChecked={ checked } type="checkbox" className="
                appearance-none flex items-center relative w-14 h-8 cursor-pointer
                before:absolute before:w-full before:h-full before:block before:rounded-2xl before:bg-gray-200
                before:inset-shadow-[0_2px_4px_rgb(0_0_0_/_0.05)]
                
                after:bg-white after:block after:size-6 after:rounded-full after:transition-all after:ease-in
                after:ml-1 after:absolute after:shadow-[0_3px_1px_rgb(0_0_0_/_0.05)]
                
                checked:after:ml-7 checked:before:bg-emerald-200 disabled:before:bg-gray-100
                disabled:after:bg-gray-200 disabled:cursor-auto 
                disabled:before:inset-shadow-none disabled:after:shadow-none
            " disabled={disabled} />
        </>
    )
}