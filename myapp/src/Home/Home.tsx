import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Dashboard } from "../Dashboard/dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import styles from "../Home/Home.module.css";

import {
  fetchLists,
  deleteList,
  deleteProduct,
  updateProduct,
  type ShoppingList,
  type Product,
} from "../redux/productSlice";

const Home: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<any>();

  
  const {
    items = [],
    status = "idle",
    error = null,
  } = useSelector((s: RootState) => s.ShoppingList || {});


  const [isOpen, setIsOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  
  useEffect(() => {
    if (user?.id) {
    
      dispatch(fetchLists(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className={styles.home}>
      <div className={styles.top}>
        <p>Dashboard</p>
      </div>

      <div className={styles.container}>
        <Dashboard />

        <div className={styles.lists}>
          <h2>Shopping Lists</h2>

          {status === "pending" && <p>Loading...</p>}
          {status === "error" && <p>{error}</p>}
          {status === "succeed" && items.length === 0 && (
            <p>No items added yet, please add shopping lists</p>
          )}

          {status === "succeed" && items.length > 0 && (
            <ul>
              {items.map((list) => (
                <li key={list.id}>
                  <div className={styles.listcontainer}>
                    <div className={styles.listcard}>
                      <div className={styles.listname}>{list.name}</div>

                      <div className={styles.list_items}>
                        {list.products?.map((p) => (
                          <div key={p.id} className={styles.items}>
                            <div className={styles.item}>
                              <p>Product</p>
                              <span>{p.name}</span>
                            </div>
                            <div className={styles.item}>
                              <p>Quantity</p>
                              <span>{p.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={styles.buttons}>
                        <button
                          onClick={() => {
                            setSelectedList(list);
                            setIsDeleteOpen(true);
                          }}
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => {
                            setSelectedList(list);
                            setIsOpen(true);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


      {isDeleteOpen && selectedList && (
        <div className={styles.deleteList}>
          <div className={styles.deleteicon}>
            <button onClick={() => setIsDeleteOpen(false)}>X</button>
          </div>
          <p>Are You Sure You Want To Delete The List "{selectedList.name}"?</p>
          <div className={styles.buttons}>
            <button
              onClick={async () => {
                if (!selectedList) return;
           
                await dispatch(deleteList((selectedList.id)));
                setIsDeleteOpen(false);
                setSelectedList(null);
                if (user?.id) dispatch(fetchLists(user.id));
              }}
            >
              Yes
            </button>
            <button onClick={() => setIsDeleteOpen(false)}>No</button>
          </div>
        </div>
      )}

   
      {isOpen && selectedList && (
        <div className={styles.modal}>
          <div className={styles.popicon}>
            <button onClick={() => setIsOpen(false)}>
              <FontAwesomeIcon icon={faX} className={styles.icon} />
            </button>
          </div>

          <div className={styles.poplistcontainer}>
            <h2>Shopping List: {selectedList.name}</h2>
          </div>

          <div className={styles.values}>
            {/* keep your exact map + classes */}
            {selectedList.products.map((p: Product) => (
              <div key={p.id} className={styles.popitems}>
                <p>{p.id}</p>

                <img
                  src={`/uploads/${user?.id}/${selectedList.id}/${p.name.toLowerCase()}.jpeg`}
                  alt={p.name}
                  className={styles.productImage}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `/uploads/${user?.id}/${selectedList.id}/${p.name.toLowerCase()}.jpg`;
                  }}
                />

             
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) =>
                    setSelectedList((prev: ShoppingList | null) =>
                      prev
                        ? {
                            ...prev,
                            products: prev.products.map((prod: Product) =>
                              prod.id === p.id
                                ? { ...prod, name: e.target.value }
                                : prod
                            ),
                          }
                        : prev
                    )
                  }
                />

                <input
                  type="number"
                  value={p.quantity}
                  onChange={(e) =>
                    setSelectedList((prev: ShoppingList | null) =>
                      prev
                        ? {
                            ...prev,
                            products: prev.products.map((prod: Product) =>
                              prod.id === p.id
                                ? { ...prod, quantity: +e.target.value }
                                : prod
                            ),
                          }
                        : prev
                    )
                  }
                />

                <div className={styles.buttons}>
                  <button
                    onClick={async () => {
                      if (!selectedList) return;
                      const updated = selectedList.products.find(
                        (prod) => prod.id === p.id
                      );
                      if (!updated) return;

                      await dispatch(
                        updateProduct({ listId: selectedList.id, product: updated })
                      );

                      // refresh from server to keep Redux + UI in sync
                      if (user?.id) dispatch(fetchLists(user.id));
                    }}
                  >
                    Save
                  </button>

                  <button
                    onClick={async () => {
                      if (!selectedList) return;
                      if (
                        window.confirm(`Delete product "${p.name}" from this list?`)
                      ) {
                        await dispatch(
                          deleteProduct({
                            listId: selectedList.id,
                            productId: p.id,
                          })
                        );

                        // update modal view immediately
                        setSelectedList((prev) =>
                          prev
                            ? {
                                ...prev,
                                products: prev.products.filter(
                                  (prod) => prod.id !== p.id
                                ),
                              }
                            : prev
                        );

                        // refresh server state
                        if (user?.id) dispatch(fetchLists(user.id));
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
