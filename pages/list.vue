<template>
    <UContainer>
        <UTable :rows="rows" />
        <div
            class="flex justify-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
        >
            <UPagination
                v-model="page"
                :page-count="pageCount"
                :total="list.length"
            />
        </div>
    </UContainer>
</template>
<script setup lang="ts">
import { type Userinfo } from "@/structure/userinfo.ts"

const page: Ref<number> = ref(1)
const pageCount: Ref<number> = ref(10)

const list: Ref<Userinfo[]> = ref([])

const rows = computed(() => {
    return list.value.slice(
        (page.value - 1) * pageCount.value,
        page.value * pageCount.value
    )
})

onMounted(() => {
    list.value = [
        {
            id: 1,
            name: "Lindsay Walton",
            title: "Front-end Developer",
            email: "lindsay.walton@example.com",
            role: "Member",
        },
        {
            id: 2,
            name: "Courtney Henry",
            title: "Designer",
            email: "courtney.henry@example.com",
            role: "Admin",
        },
        {
            id: 3,
            name: "Tom Cook",
            title: "Director of Product",
            email: "tom.cook@example.com",
            role: "Member",
        },
        {
            id: 4,
            name: "Whitney Francis",
            title: "Copywriter",
            email: "whitney.francis@example.com",
            role: "Admin",
        },
        {
            id: 5,
            name: "Leonard Krasner",
            title: "Senior Designer",
            email: "leonard.krasner@example.com",
            role: "Owner",
        },
        {
            id: 6,
            name: "Floyd Miles",
            title: "Principal Designer",
            email: "floyd.miles@example.com",
            role: "Member",
        },
        {
            id: 7,
            name: "Jane Doe",
            title: "Software Engineer",
            email: "jane.doe@example.com",
            role: "Member",
        },
        {
            id: 8,
            name: "John Smith",
            title: "Project Manager",
            email: "john.smith@example.com",
            role: "Admin",
        },
        {
            id: 9,
            name: "Emily Davis",
            title: "UX Designer",
            email: "emily.davis@example.com",
            role: "Member",
        },
        {
            id: 10,
            name: "Michael Brown",
            title: "Backend Developer",
            email: "michael.brown@example.com",
            role: "Member",
        },
        {
            id: 11,
            name: "Jessica Johnson",
            title: "QA Engineer",
            email: "jessica.johnson@example.com",
            role: "Admin",
        },
        {
            id: 12,
            name: "Daniel Wilson",
            title: "Product Manager",
            email: "daniel.wilson@example.com",
            role: "Member",
        },
        {
            id: 13,
            name: "Laura Martinez",
            title: "DevOps Engineer",
            email: "laura.martinez@example.com",
            role: "Owner",
        },
        {
            id: 14,
            name: "James Anderson",
            title: "Full Stack Developer",
            email: "james.anderson@example.com",
            role: "Member",
        },
        {
            id: 15,
            name: "Sarah Taylor",
            title: "Technical Writer",
            email: "sarah.taylor@example.com",
            role: "Admin",
        },
        {
            id: 16,
            name: "Chris Lee",
            title: "Data Scientist",
            email: "chris.lee@example.com",
            role: "Member",
        },
        {
            id: 17,
            name: "Kimberly White",
            title: "Product Designer",
            email: "kimberly.white@example.com",
            role: "Owner",
        },
        {
            id: 18,
            name: "Paul Harris",
            title: "Marketing Manager",
            email: "paul.harris@example.com",
            role: "Admin",
        },
        {
            id: 19,
            name: "Nancy Clark",
            title: "HR Manager",
            email: "nancy.clark@example.com",
            role: "Member",
        },
        {
            id: 20,
            name: "Kevin Thompson",
            title: "Software Architect",
            email: "kevin.thompson@example.com",
            role: "Member",
        },
    ]
})
</script>
