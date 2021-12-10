package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	//"io/ioutil"
	"strconv"
	"os/exec"
	"strings"
	//"reflect"

	"github.com/gorilla/mux"
)

type ram struct {
	TOTAL		int	`json:TOTAL`
	FREE		int	`json:FREE`
	SHARED		int	`json:SHARED`
	CACHED		int	`json:CACHED`
	CONSUMIDA	int `json:CONSUMIDA`
	PCT			int	`json:PCT`
}

type proc_hijo struct {
	PID		int		`json:PID`
	NOMBRE	string	`json:NOMBRE`
}

type proc struct {
	PID		int			`json:PID`
	NOMBRE	string		`json:NOMBRE`
	UID		int			`json:UID`
	ESTADO	int			`json:ESTADO`
	RAM		int			`json:RAM`
	RAM_BYTES	int		`json:RAM_BYTES`
	HIJOS	[]proc_hijo	`json:HIJOS`
}


func middlewareCors(next http.Handler) http.Handler {
	return http.HandlerFunc (
		func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
			
			next.ServeHTTP(w, req)
		})
}

func enableCORS(router *mux.Router) {
	router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
	}).Methods(http.MethodOptions)
	
	router.Use(middlewareCors)
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Raiz del Servidor")
}

func ramHandler(w http.ResponseWriter, r *http.Request) {
	// Obtener datos del modulo
	cmd := exec.Command("sh", "-c", "cat /proc/memo_201603168")
	out, err := cmd.CombinedOutput()

	if err != nil {
		log.Println("Exploto memo_201603168")
		log.Fatal(err)
	}

	var newRAM ram
	json.Unmarshal(out, &newRAM)

	// Calcular Cache
	cmd = exec.Command("sh", "-c", "free | head --line=2 | tail --line=1 | awk '{print $6}'")
	out2, err2 := cmd.CombinedOutput()

	if err2 != nil {
		log.Println("Exploto el comando de Buffers")
		log.Fatal(err2)
	}

	buffer := string(out2[:])
	iBuffer, err3 := strconv.Atoi(strings.Replace(buffer, "\n", "", -1))

	if err3 != nil {
		log.Println("Exploto la conversion a int")
		log.Fatal(err3)
	}

	newRAM.CACHED = iBuffer

	// Calcular porcentaje
	newRAM.CONSUMIDA = (newRAM.TOTAL - newRAM.FREE - newRAM.CACHED) + newRAM.SHARED
	newRAM.PCT = newRAM.CONSUMIDA * 100 / newRAM.TOTAL

	// Convertir KB a MB
	newRAM.TOTAL = (newRAM.TOTAL + newRAM.SHARED) / 1024
	newRAM.FREE = newRAM.FREE / 1024
	newRAM.SHARED = newRAM.SHARED / 1024
	newRAM.CACHED = newRAM.CACHED / 1024
	newRAM.CONSUMIDA = newRAM.CONSUMIDA / 1024

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newRAM)
}

func procHandler(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_201603168")
	out, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatal("Exploto cpu_201603168")
	}

	toString := string(out[:])
	
	w.Header().Set("Content-Type", "application/json")
	//json.NewEncoder(w).Encode(toString)
	fmt.Fprintf(w, toString)
}

func procKillHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	task_ID, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Fprintf(w, "Invalid ID")
		return
	}
	
	auxCMD := fmt.Sprint("sudo kill ", task_ID)
	cmd := exec.Command("sh", "-c", auxCMD)
	_, err2 := cmd.CombinedOutput()

	if err2 != nil {
		log.Fatal("Exploto cpu_201603168")
	}
	
	fmt.Fprintf(w, "Proceso eliminado correctamente")
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	enableCORS(router)

	router.HandleFunc("/", rootHandler).Methods("GET")
	router.HandleFunc("/ram", ramHandler).Methods("GET")
	router.HandleFunc("/proc", procHandler).Methods("GET")
	router.HandleFunc("/proc/{id}", procKillHandler).Methods("DELETE")

	fmt.Println("Servidor Corriendo En Puerto 4000")
	if err := http.ListenAndServe(":4000", router); err != nil {
		log.Fatal(err)
		return
	}
}
