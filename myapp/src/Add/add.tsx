import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {type RootState } from "../redux/store";
import styles from "./Add.module.css";
import { addShoppingList, type ShoppingList, type Product } from "../redux/productSlice";
import { Dashboard } from "../Dashboard/dashboard";

const Add: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [listName, setListName] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [showProductModal, setShowProductModal] = useState(false);

  const addProductToList = () => {
    if (!productName) return;
    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      quantity: productQuantity,
    };
    setProducts([...products, newProduct]);
    setProductName("");
    setProductQuantity(1);
  };

  const saveShoppingList = async () => {
    if (!user?.id) return alert("User not logged in");
    if (!listName) return alert("List name required");

    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: listName,
      userId: user.id,
      products,
    };

    await dispatch(addShoppingList(newList));

    setListName("");
    setProducts([]);
    setShowProductModal(false);
  };

  return (
    <div className={styles.Add}>
      <Dashboard/>
      <div className={styles.top}>
        <p>Add New List</p>
      </div>
      <div className={styles.container}>
        <h2>Add New Shopping List</h2>
        <input
          type="text"
          placeholder="Shopping List Name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />
        <button onClick={() => setShowProductModal(true)}>Add Products</button>

        {showProductModal && (
          <div className={styles.modal}>
            <div className={styles.popicon}>
              <button onClick={() => setShowProductModal(false)}>X</button>
            </div>
            <h3>Add Products to "{listName}"</h3>
            <div className={styles.values}>
              {products.map((p) => (
                <div key={p.id} className={styles.popitems}>
                  <span>{p.name}</span>
                  <span>Qty: {p.quantity}</span>
                </div>
              ))}

              <input
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={productQuantity}
                onChange={(e) => setProductQuantity(+e.target.value)}
              />
              <button onClick={addProductToList}>Add Product</button>
            </div>
          </div>
        )}

        {products.length > 0 && (
          <button onClick={saveShoppingList}>Save Shopping List</button>
        )}
      </div>
    </div>
  );
};

export default Add;
