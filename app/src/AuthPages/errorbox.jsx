import "../index.css";

function ErrorBox({message}) {
    return (
        <>
            <div>
                {message ? <label className="text-red-500 font-satoshi-light">{message}</label> : <label className="text-red-500 font-satoshi-light">Field Required</label>}
                
            </div>
            
        </>

    );
}

export default ErrorBox;
