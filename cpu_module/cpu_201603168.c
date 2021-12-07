#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/mm.h>
#include <linux/seq_file.h>
#include <linux/proc_fs.h>
#include <linux/init.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("DOUGLAS MARTINEZ");
MODULE_DESCRIPTION("CPU INFO MODULE");
MODULE_VERSION("1.0.0");

static int show_cpu_data(struct seq_file *m, void *v)
{
    struct task_struct *task_list;
    size_t proc_count = 0;

    for_each_process(task_list) {
        seq_printf(m, "=> %s [%d]\n", task_list->comm, task_list->pid);
        proc_count++;
    }

    seq_printf(m, "No. Procesos: %zu\n", proc_count);

    return 0;
}

static ssize_t write_file_proc(struct file *file, const char __user *buffer, size_t count, loff_t *f_pos)
{
    return 0;
}

static int open_file_proc(struct inode *inode, struct file *file)
{
    return single_open(file, show_cpu_data, NULL);
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

static int __init cpu_read_init(void)
{
    struct proc_dir_entry *entry;
    entry = proc_create("cpu_201603168", 0777, NULL, &fops);

    if(!entry) 
    {
        return -1;
    } else 
    {
        printk(KERN_INFO "DOUGLAS OMAR ARREOLA MARTINEZ\n");
    }
    
    return 0;
}

static void __exit cpu_read_exit(void)
{
    remove_proc_entry("cpu_201603168", NULL);
    printk(KERN_INFO "DICIEMBRE 2021\n");
}

module_init(cpu_read_init);
module_exit(cpu_read_exit);