package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"io/ioutil"
	"strconv"

	"github.com/gorilla/mux"
)

type task struct {
	ID      int    `json:ID`
	Name    string `json:Name`
	Content string `json:Content`
}

type allTasks []task

var tasks = allTasks{
	{
		ID:      1,
		Name:    "Tarea Uno",
		Content: "Contenido Random",
	},
}

// w es la respuesta que se devuelve
// r* es la solicitud que realiza el usuario
func rootHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Raiz del Servidor")
}

func getTasksHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func createTaskHandler(w http.ResponseWriter, r *http.Request) {
	var newTask task
	reqBody, err := ioutil.ReadAll(r.Body)

	if err != nil {
		fmt.Fprintf(w, "Insertar datos validos")
	}
	json.Unmarshal(reqBody, &newTask)

	newTask.ID = len(tasks) + 1
	tasks = append(tasks, newTask)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTask)
}

func getTaskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	// Este es el nombre que se le especifica en la direccion de router.HandleFunc()
	task_ID, err := strconv.Atoi(vars["id"])

	// En este caso solo si el id dado no se puede convertir a numero,
	// si es un numero que no existe, se va a ir al for y como no entrara al if
	// el func devolvera algo vacio
	if err != nil {
		fmt.Fprintf(w, "Invalid ID")
		return
	}

	for _, task := range tasks {
		if task.ID == task_ID {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(task)
		}
	}
}

func deleteTaskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	task_ID, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Fprintf(w, "Invalid ID")
		return
	}

	for i, task := range tasks {
		if task.ID == task_ID {
			tasks = append(tasks[:i], tasks[i + 1:]...)

			w.Header().Set("Content-Type", "application/json")
			fmt.Fprintf(w, "Task con ID %v eliminado satisfactoriamente", task_ID)
		}
	}
}

func updateTaskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	task_ID, err := strconv.Atoi(vars["id"])
	if err != nil {
		fmt.Fprintf(w, "Invalid ID")
		return
	}

	var updated task

	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Insertar datos validos")
		return
	}

	json.Unmarshal(reqBody, &updated)

	for i, task := range tasks {
		if task.ID == task_ID {
			tasks = append(tasks[:i], tasks[i + 1:]...)

			updated.ID = task_ID
			tasks = append(tasks, updated)

			w.Header().Set("Content-Type", "application/json")
			fmt.Fprintf(w, "Task con ID %v modificado correctamente", task_ID)
		}
	}
}

func main() {
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/", rootHandler).Methods("GET")
	router.HandleFunc("/tasks", getTasksHandler).Methods("GET")
	router.HandleFunc("/tasks", createTaskHandler).Methods("POST")
	router.HandleFunc("/tasks/{id}", getTaskHandler).Methods("GET")
	router.HandleFunc("/tasks/{id}", deleteTaskHandler).Methods("DELETE")
	router.HandleFunc("/tasks/{id}", updateTaskHandler).Methods("PUT")

	fmt.Println("Servidor Corriendo En Puerto 4000")
	if err := http.ListenAndServe(":4000", router); err != nil {
		log.Fatal(err)
		return
	}
}
