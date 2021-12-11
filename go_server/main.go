package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"os/exec"
	"strings"
	"math"
	//"reflect"

	"github.com/gorilla/mux"
)

type ram struct {
	TOTAL		int	`json:TOTAL`
	FREE		int	`json:FREE`
	SHARED		int	`json:SHARED`
	CACHED		int	`json:CACHED`
	CONSUMIDA	int `json:CONSUMIDA`
	PCT			float64 `json:PCT`
}

type proc_hijo struct {
	PID		int		`json:PID`
	NOMBRE	string	`json:NOMBRE`
}

type proc struct {
	PID		int			`json:PID`
	NOMBRE	string		`json:NOMBRE`
	UID		int			`json:UID`
	UNAME	string		`json:UNAME`
	ESTADO	int			`json:ESTADO`
	ENAME	string		`json:ENAME`
	RAM		int			`json:RAM`
	RAM_BYTES	int		`json:RAM_BYTES`
	HIJOS	[]proc_hijo	`json:HIJOS`
}

type usuario struct {
	ID		int 	`json:ID`
	NAME 	string	`json:NAME`
}

var listaUsuarios []usuario

func searchName(uid int) string {
	// Buscar antes de hacer el comando getent
	for _, user := range listaUsuarios {
		if user.ID == uid {
			//fmt.Println("Encontrado en Lista")
			return user.NAME
		}
	}

	// No se encontro previamente el usuario, asi que se busca con el comando getent
	auxCMD := fmt.Sprint("getent passwd ", uid, " | cut -d: -f1")
	cmd := exec.Command("sh", "-c", auxCMD)
	out, err := cmd.CombinedOutput()

	if err != nil {
		fmt.Println("No se pudo obtener el nombre")
		log.Fatal(err)
	}
	
	var newUser usuario
	newUser.ID = uid
	newUser.NAME = strings.Replace(string(out[:]), "\n", "", -1)
	//fmt.Println("No listado, pero agregado:",newUser.NAME)
	listaUsuarios = append(listaUsuarios, newUser)

	return newUser.NAME
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func toFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num * output)) / output
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
	// Obtener datos del modulo RAM
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
	newRAM.PCT = toFixed(float64(newRAM.CONSUMIDA) * 100 / float64(newRAM.TOTAL), 2)

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
	// Obtener datos del modulo CPU (realmente es el modulo de los procesos)
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_201603168")
	out, err := cmd.CombinedOutput()

	if err != nil {
		fmt.Println("Exploto cpu_201603168")
		log.Fatal(err)
	}

	var newProcs []proc
	json.Unmarshal(out, &newProcs)

	// Obtener usuarios y Contabilizar estados
	//var numEjecucion 	int
	//var numSuspendidos 	int
	//var numDetenidos 	int
	//var numZombie 		int
	//totalProcesos := len(newProcs)
	
	for i, proceso := range newProcs {
		newProcs[i].UNAME = searchName(proceso.UID)

		//Contabilizar los estados
		
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newProcs)
}

func procKillHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	task_ID, err := strconv.Atoi(vars["id"])

	if err != nil {
		fmt.Fprintf(w, "Invalid ID")
		return
	}
	
	auxCMD := fmt.Sprint("kill ", task_ID)
	cmd := exec.Command("sh", "-c", auxCMD)
	_, err2 := cmd.CombinedOutput()

	if err2 != nil {
		log.Fatal("Exploto cpu_201603168")
	}
	
	// Devolver estado o mensaje para que el front entienda que la operacion fue exitosa
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
