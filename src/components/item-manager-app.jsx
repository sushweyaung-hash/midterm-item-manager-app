import "./item-manager-app.css";

import { useState, useRef } from "react";

import deleteLogo from "../assets/delete.svg";
import stationaryLogo from "../assets/ink_pen.svg";
import kitchenwareLogo from "../assets/flatware.svg";
import applianceLogo from "../assets/electrical_services.svg";

function ItemManager() {
  /*
   * !!! IMPORTANT !!!
   * - You MUST use the given states and refs in your code.
   * - You MAY add additional state, refs, and variables if needed.
   */
  const [items, setItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // You must use this ref for the item name input
  const itemName = useRef(null);

  // Extra refs (allowed)
  const itemCategory = useRef(null);
  const itemPrice = useRef(null);

  // Auto-increment id that never goes backward (even after delete)
  const nextId = useRef(1);

  const getCategoryIcon = (category) => {
    if (category === "Stationary") return stationaryLogo;
    if (category === "Kitchenware") return kitchenwareLogo;
    if (category === "Appliance") return applianceLogo;
    return null;
  };

  const validate = (name, category, priceStr) => {
    const trimmedName = name.trim();

    if (trimmedName.length === 0) return "Item name must not be empty";

    const isDup = items.some(
      (it) => it.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDup) return "Item must not be duplicated";

    if (category !== "Stationary" && category !== "Kitchenware" && category !== "Appliance")
      return "Please select a category";

    const priceNum = Number(priceStr);
    if (!Number.isFinite(priceNum) || priceNum < 0) return "Price must not be less than 0";

    return "";
  };

  const clearInputs = () => {
    if (itemName.current) itemName.current.value = "";
    if (itemCategory.current) itemCategory.current.value = "";
    if (itemPrice.current) itemPrice.current.value = "0";
  };

  const handleAddItem = () => {
    const name = itemName.current?.value ?? "";
    const category = itemCategory.current?.value ?? "";
    const priceStr = itemPrice.current?.value ?? "";

    const err = validate(name, category, priceStr);
    if (err) {
      setErrorMsg(err);
      return;
    }

    setErrorMsg("");

    const newItem = {
      id: nextId.current,
      name: name.trim(),
      category,
      price: Number(priceStr),
    };

    nextId.current += 1;
    setItems((prev) => [...prev, newItem]);

    clearInputs();
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <>
      <div id="h1">Item Management</div>

      <div id="data-area">
        <table id="item-table" className="item-table">
          <thead>
            <tr>
              <th id="col-item-id">ID</th>
              <th id="col-item-name">Name</th>
              <th id="col-item-category">Category</th>
              <th id="col-item-price">Price</th>
              <th id="col-item-action">Action</th>
            </tr>
          </thead>

          <tbody>
            {/* All items must be listed here (above the form row). */}
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>{item.name}</td>

                <td>
                  <img
                    src={getCategoryIcon(item.category)}
                    alt={item.category}
                    title={item.category}
                    style={{ width: 20, height: 20 }}
                  />
                </td>

                <td>{item.price.toFixed(2)}</td>

                <td>
                  <img
                    src={deleteLogo}
                    alt="Delete"
                    title="Delete"
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                  />
                </td>
              </tr>
            ))}

            {/* Your input form must be implemented as the LAST row in this table. */}
            <tr>
              <td></td>

              <td>
                <input ref={itemName} type="text" />
              </td>

              <td>
                <select ref={itemCategory} defaultValue="">
                  <option value=""></option>
                  <option value="Stationary">Stationary</option>
                  <option value="Kitchenware">Kitchenware</option>
                  <option value="Appliance">Appliance</option>
                </select>
              </td>

              <td>
                <input ref={itemPrice} type="number" step="0.01" defaultValue="0" />
              </td>

              <td>
                <button type="button" onClick={handleAddItem}>
                  Add Item
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="error-message">{errorMsg}</div>
    </>
  );
}

export default ItemManager;
