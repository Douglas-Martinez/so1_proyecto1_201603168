obj-m := memo_201603168.o

KDIR := /lib/modules/$(shell uname -r)/build
VERBOSE = 0

all:
	$(MAKE) -C $(KDIR) M=$(PWD) KBUILD_VERBOSE=$(VERBOSE) CONFIG_DEBUG_INFO=y modules

clean:
	@rm -f *.o *.ko *.mod *.mod.c .memo_201603168.* *.symvers *.order

modup:
	@echo "CARNET: 201603168"
	@sudo dmesg -C
	@sudo insmod memo_201603168.ko

moddown:
	@echo "CURSO: SISTEMAS OPERATIVOS 1"
	@sudo rmmod memo_201603168.ko