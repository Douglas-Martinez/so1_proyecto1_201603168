obj-m := cpu_201603168.o

KDIR := /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(shell pwd)

clean:
	$(MAKE) -C $(KDIR) M=$(shell pwd) clean

up:
	@echo "NOMBRE: DOUGLAS OMAR ARREOLA MARTINEZ"
	@sudo insmod cpu_201603168.ko

down:
	@echo "DICIEMBRE 2021"
	@sudo rmmod cpu_201603168.ko