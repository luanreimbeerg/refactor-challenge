import { useEffect, useState } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface Foods {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface AddFood {
  image: string;
  name: string;
  price: string;
  description: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<Foods[]>([]);
  const [editingFood, seteditingFood] = useState<Foods>({} as Foods);
  const [modalOpen, setmodalOpen] = useState(false);
  const [editModalOpen, seteditModalOpen] = useState(false);

  useEffect(() => {
    api.get("/foods").then((response) => setFoods(response.data));
  }, []);

  async function handleAddFood(food: AddFood) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      const newFoods = [...foods, response.data];

      setFoods(newFoods);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: AddFood) {
    try {
      console.log(editingFood);

      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setmodalOpen(modalOpen);
  }

  function toggleEditModal() {
    seteditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: Foods) {
    seteditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
