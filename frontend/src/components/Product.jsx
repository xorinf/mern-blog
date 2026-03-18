
function Product(props) { // x is key value is : productObj
    // state
    const { productObj } = props;
    // return a react element
    return (
     
            <div className="shadow-2xl p-2 font-mono">
                <h1>Meow</h1>
                <h2 className="text-2xl text-blue-400">{productObj.title}</h2>
                <p className="font-bold">{productObj.price}</p>
                <p className="font-bold">{productObj.description}</p>
            </div>
    )

}

export default Product;