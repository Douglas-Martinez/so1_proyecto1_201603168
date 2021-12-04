obj-m := cpu_201603168.o

KDIR := /lib/modules/$(shell uname -r)/build
VERBOSE = 0

all:
	$(MAKE) -C $(KDIR) M=$(PWD) KBUILD_VERBOSE=$(VERBOSE) CONFIG_DEBUG_INFO=y modules

clean:
	@rm -f *.o *.ko *.mod *.mod.c .cpu_201603168.* *.symvers *.order

modup:
	@echo "NOMBRE: DOUGLAS OMAR ARREOLA MARTINEZ"
	@sudo dmesg -C
	@sudo insmod cpu_201603168.ko

moddown:
	@echo "DICIEMBRE 2021"
	@sudo rmmod cpu_201603168.ko