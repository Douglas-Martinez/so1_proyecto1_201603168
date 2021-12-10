#include <linux/sched.h>
#include <linux/sysinfo.h>
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

struct sysinfo si;

struct task_struct *task_list;

struct list_head *lista_hijos;
struct task_struct *hijo;

static int show_cpu_data(struct seq_file *m, void *v)
{
    #define K(x) ((x) << (PAGE_SHIFT - 10))
    si_meminfo(&si);

    seq_printf(m, "[\n");
    for_each_process(task_list) 
    {
        unsigned long rss;
        get_task_struct(task_list);

        seq_printf(m, "\t{\n");
        seq_printf(m, "\t\t\"PID\": %d,\n", task_list->pid);
        seq_printf(m, "\t\t\"NOMBRE\": \"%s\",\n", task_list->comm);
        seq_printf(m, "\t\t\"UID\": %d,\n", __kuid_val(task_list->real_cred->uid));
        seq_printf(m, "\t\t\"ESTADO\": %ld,\n", task_list->state);
        if(task_list->mm)
        {
            rss = get_mm_rss(task_list->mm) << PAGE_SHIFT;
            seq_printf(m, "\t\t\"RAM\": %lu,\n", (rss/1024)*100/K(si.totalram));
            seq_printf(m, "\t\t\"RAM_BYTES\": %lu,\n", rss/1024);
        } else
        {
            seq_printf(m, "\t\t\"RAM\": -1,\n");
            seq_printf(m, "\t\t\"RAM_BYTES\": -1,\n");
        }
        
        seq_printf(m, "\t\t\"HIJOS\": [\n");
        list_for_each(lista_hijos, &(task_list->children))
        {
            hijo = list_entry(lista_hijos, struct task_struct, sibling);
            
            seq_printf(m, "\t\t\t{\n");
            seq_printf(m, "\t\t\t\t\"PID\": %d,\n", hijo->pid);
            seq_printf(m, "\t\t\t\t\"NOMBRE\": \"%s\"\n", hijo->comm);
            seq_printf(m, "\t\t\t},\n");
        }
        seq_printf(m, "\t\t]\n");

        seq_printf(m, "\t},\n");
    }
    seq_printf(m, "]\n");
    
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