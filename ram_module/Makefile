obj-m := memo_201603168.o

KDIR := /lib/modules/$(shell uname -r)/build

all:
	$(MAKE) -C $(KDIR) M=$(shell pwd)

clean:
	$(MAKE) -C $(KDIR) M=$(shell pwd) clean

up:
	@echo "CARNET: 201603168"
	@sudo dmesg -C
	@sudo insmod memo_201603168.ko

down:
	@echo "CURSO: SISTEMAS OPERATIVOS 1"
	@sudo rmmod memo_201603168.ko