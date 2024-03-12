<script setup>
import { collection, onSnapshot, addDoc, deleteDoc, setDoc, doc, } from "firebase/firestore";
import db from "./Firebase/config.js";
import { onMounted, ref } from "vue";
import { computed } from "vue";

const expenses = ref([]);
const name = ref("");
const category = ref("");
const amount = ref("");
const isEditing = ref(false);
const editId = ref(null);

const buttonText = computed(() => {
  return isEditing.value ? "Save Expense" : "Add Expense";
});

const getExpenses = async () => {
  onSnapshot(collection(db, "ExpenseTracker"), (querySnap) => {
    const tmp = [];
    querySnap.forEach((doc) => {
      const expense = { id: doc.id, data: doc.data() };
      tmp.push(expense);
    });
    expenses.value = tmp.sort((a, b) => a.data.category - b.data.category);
  });
};

const addExpense = async () => {
  if (
    !name.value.trim() ||
    !category.value.trim() ||
    !amount.value.toString().trim()
  ) {
    alert("Enter data first");
    return;
  }

  const data = {
    datetime: new Date(),
    name: name.value,
    category: category.value,
    amount: amount.value,
  };

  if (isEditing.value) {
    await updateExpense(editId.value, data);
  } else {
    await addDoc(collection(db, "ExpenseTracker"), data);
  }

  name.value = "";
  category.value = "";
  amount.value = "";
  isEditing.value = false;
  editId.value = null;
};

const onDelete = async (id) => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this data?"
  );
  if (confirmDelete) {
    await deleteDoc(doc(db, "ExpenseTracker", id));
    expenses.value = expenses.value.filter((expense) => expense.id !== id);
  }
};

const onEdit = async (id) => {
  const expense = expenses.value.find((expense) => expense.id === id);

  name.value = expense.data.name;
  category.value = expense.data.category;
  amount.value = expense.data.amount;
  isEditing.value = true;
  editId.value = id;
};

const updateExpense = async (id, data) => {
  await setDoc(doc(db, "ExpenseTracker", id), data);
};

const formatDateTime = (timestamp) => {
  if (!timestamp || !timestamp.seconds) {
    return "Invalid Date";
  }

  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  const date = new Date(milliseconds);
  return date.toLocaleString();
};

const totalExpense = computed(() => {
  let total = expenses.value.reduce((acc, expense) => {
    return acc + parseFloat(expense.data.amount);
  }, 0);
  return "$" + total.toFixed(2);
});

onMounted(() => {
  getExpenses();
});
</script>

<template>
  <div class="justify-center items-center h-full">
    <div>
      <h1 class="m-5 text-5xl font-bold">EXPENSE TRACKER</h1>

      <div class="flex flex-col justify-center mx-auto md:flex-row">
        <div
          class="lg:w-1/3 m-3 p-3 border border-slate-900 rounded"
          style="height: 500px; background-color: whitesmoke"
        >
          <form
            @submit.prevent="addExpense"
            class="flex flex-col"
            style="height: 100%"
          >
            <label for="name" class="my-5 text-2xl">Item: </label>
            <input
              type="text"
              v-model="name"
              class="border border-slate-500 rounded mb-5 p-2"
            />

            <label for="category" class="my-5 text-2xl">Category: </label>
            <select
              v-model="category"
              class="mb-5 border border-slate-500 rounded p-2"
            >
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Equipments">Equipments</option>
              <option value="Gadgets">Gadgets</option>
              <option value="Gadgets">Materials</option>
            </select>

            <label for="amount" class="my-5 text-3xl">Amount: </label>
            <input
              type="number"
              v-model="amount"
              class="border border-slate-500 rounded mb-5 p-2"
            />
            <button
              type="submit"
              class="border-2 py-2 rounded text-black hover:opacity-80 hover:border-black hover:text-white hover:bg-black transition ease-linear duration-100"
            >
              {{ buttonText }}
            </button>
          </form>
        </div>

        <div class="lg:w-2/3 m-3" style="max-height: 450px; width: 100%">
          <div>
            <table class="scrolldown">
              <thead class="bg-white">
                <tr>
                  <th class="px-3 py-2 border">Item</th>
                  <th class="px-3 py-2 border">Category</th>
                  <th class="px-3 py-2 border">Amount</th>
                  <th class="px-3 py-2 border">Date & Time</th>
                  <th class="px-3 py-2 border">...</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="expense in expenses" :key="expense.id">
                  <td class="px-3 py-2 border nowrap">
                    {{ expense.data.name }}
                  </td>
                  <td class="px-3 py-2 border nowrap">
                    {{ expense.data.category }}
                  </td>
                  <td class="px-3 py-2 border nowrap">
                    {{ "$" + parseFloat(expense.data.amount).toFixed(2) }}
                  </td>
                  <td class="px-3 py-2 border nowrap">
                    {{ formatDateTime(expense.data.datetime) }}
                  </td>
                  <td class="px-3 py-2 border text-center">
                    <button @click="onEdit(expense.id)" class="mx-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                        EDIT
                    </button>
                    <button @click="onDelete(expense.id)" class="mx-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
                        DELETE
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="px-3 py-2 border-1 bg-white">
                    Total Expenses: {{ totalExpense }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
    background-color: bisque;
}

table.scrolldown {
  height: 450px;
}

table.scrolldown tbody,
table.scrolldown thead {
  display: block;
}

thead,
tfoot {
  border: 3px solid black;
}

table.scrolldown tbody {
  height: 364.4px;
  overflow: auto;
  width: 100%;
}

table.scrolldown tbody::-webkit-scrollbar {
  display: none;
}

tbody td,
thead th {
  width: 250px;
}

.nowrap {
  white-space: nowrap;
}

td {
  text-align: center;
  border: 3px solid black;
}

table.scrolldown tbody td,
table.scrolldown thead th {
  width: auto;
  min-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

table.scrolldown tbody td,
table.scrolldown thead th {
  text-align: center;
}
</style>