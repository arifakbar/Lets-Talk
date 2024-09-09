"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/file-ipload";

import { useForm } from "react-hook-form";
import * as z from "zod"; //For form Validation
import { zodResolver } from "@hookform/resolvers/zod" //For form Validation
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(3, { message: "Min 3 letter's in server name is required." }).max(30),
    imageUrl: z.string().min(1, { message: "Server Image is required" })
})

const InitialModal = () => {

    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        try {
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    if (!isMounted) return null; //In order to remove hydration error


    return <Dialog open>
        <DialogContent className="dark:text-white text-black p-0 overflow-hidden">
            <DialogHeader className="p-6">
                <DialogTitle className="text-2xl text-center font-bold">
                    Customize your server
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500">
                    Give you server a persoanlity with name and an image. You can always change it later.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-8 px-6">
                        <div className="flex items-center justify-center text-center">
                            <FormField control={form.control} name="imageUrl" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FileUpload endpoint="serverImage" onChange={field.onChange} value={field.value} />
                                    </FormControl>
                                </FormItem>)} />
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zonc-500 dark:text-secondary/70" >Server Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" placeholder="Enter your server name" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <DialogFooter className="bg-gray-100">
                        <Button disabled={isLoading} variant="primary" >Submit</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
}

export default InitialModal;