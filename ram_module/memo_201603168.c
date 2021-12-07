#include <linux/sysinfo.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/mm.h>
#include <linux/seq_file.h>
#include <linux/proc_fs.h>
#include <linux/init.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("DOUGLAS MARTINEZ");
MODULE_DESCRIPTION("RAM INFO MODULE");
MODULE_VERSION("1.0.0");

struct sysinfo si;

static int show_ram_data(struct seq_file *m, void *v)
{
    #define K(x) ((x) << (PAGE_SHIFT - 10))

    si_meminfo(&si);
    int tot = (K(si.totalram)/1024) & __INT_MAX__;
    int fre = (K(si.freeram + si.bufferram + si.sharedram)/1024) & __INT_MAX__;
    int con = tot - fre;

    seq_printf(m, "{\"TOTAL\": %8d, \"CONSUMIDA\":%8d, \"PCT\":%6d}\n", tot, con, (con*100)/tot);

    return 0;
}

static ssize_t write_file_proc(struct file *file, const char __user *buffer, size_t count, loff_t *f_pos)
{
    return 0;
}

static int open_file_proc(struct inode *inode, struct file *file)
{
    return single_open(file, show_ram_data, NULL);
}

static struct file_operations fops = 
{
    .owner = THIS_MODULE,
    .open = open_file_proc,
    .release = single_release,
    .read = seq_read,
    .llseek = seq_lseek,
    .write = write_file_proc
};

static int __init ram_read_init(void)
{
    struct proc_dir_entry *entry;
    entry = proc_create("memo_201603168", 0777, NULL, &fops);

    if(!entry) 
    {
        return -1;
    } else 
    {
        printk(KERN_INFO "201603168\n");
    }

    return 0;
}

static void __exit ram_read_exit(void)
{
    remove_proc_entry("memo_201603168", NULL);
    printk(KERN_INFO "SISTEMAS OPERATIVOS 1\n");
}

module_init(ram_read_init);
module_exit(ram_read_exit);