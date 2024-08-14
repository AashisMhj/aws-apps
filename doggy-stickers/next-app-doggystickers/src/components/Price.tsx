type PriceProps = {
    currency: string,
    num: number,
    numSize: string
}
export default function Price({currency, num, numSize}:PriceProps){
    return <>
    {currency} <span className={numSize}>{num}</span>
    </>
}