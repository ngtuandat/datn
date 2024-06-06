import { NextApiRequest, NextApiResponse } from 'next';
import { ProductProps } from '../../../interfaces/product';
import { GetUsersQuery } from '../../../interfaces/user';
import prisma from '../../../lib/prisma';

export default function Product(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const product = req.body.product
        if (!product) return
        createProduct(product, res)
    }

    if (req.method === "GET") {
        const query = req.query
        if (!query) return
        getProduct(res, query)
    }

    if (req.method === 'PUT') {
        const product = req.body.product
        if (!product) return
        updateProduct(res, product)
    }

    if (req.method === "DELETE") {
        const id = req.body.id
        if (!id) return
        deleteProduct(res, id)
    }
}

async function createProduct(product: ProductProps, res: NextApiResponse) {
    try {
        await prisma.product.create({
            data: {
                name: product.name,
                category: product.category,
                color: product.color,
                description: product.desc,
                price: product.price,
                listImage: product.image,
                size: product.size,
                gender: product.gender
            }
        })
        res.status(200).json('Create Successful')
    } catch (error) {
        res.status(500).json(error)
    }
}

async function getProduct(res: NextApiResponse, query: GetUsersQuery) {
    const color = (query.color?.split('-'))?.map((item) => item)


    const colorFull = [
        'black', 'green', 'pink', 'white', 'red', 'blue', 'yellow', 'lime'];
    const genderFull = ['men', 'women', 'kids']
    const order = query.sort === 'desc-date' ? { createdAt: 'desc' } : query.sort === 'desc-price' ? { price: 'desc' } : query.sort === 'asc-price' ? { price: 'asc' } : { createdAt: 'asc' }
    const category = query.category === 'all' ? { in: ['Shoes', 'Accessories'] } : { contains: query.category, mode: 'insensitive' }
    try {
        const getProd = await prisma.product.findMany({
            skip: (Number(query.page || 1) - 1) * 6,
            take: Number(query.limit),
            where: {
                name: {
                    contains: query.query,
                    mode: 'insensitive'
                },
                gender: {
                    in: query.gender ? query.gender?.split('-') : genderFull,
                },
                color: {
                    hasSome: query.color ? color : colorFull,
                },
                category: Object(category),
                price: {
                    gt: query.min ? Number(query.min) : 0,
                    lt: query.max ? Number(query.max) : 999999999
                }
            },
            orderBy: Object(order)
        });

        const total = await prisma.product.count({
            where: {
                name: {
                    contains: query.query,
                    mode: 'insensitive'
                },
                gender: {
                    in: query.gender ? query.gender?.split('-') : genderFull,
                },
                color: {
                    hasSome: query.color ? color : colorFull,
                },
                category: {
                    contains: query.category,
                    mode: 'insensitive'
                },
                price: {
                    gt: query.min ? Number(query.min) : 0,
                    lt: query.max ? Number(query.max) : 999999999
                }
            },
        });

        res.status(200).json({ product: getProd, total });
    } catch (error) {
        res.status(500).json(error);
    }
}

async function updateProduct(res: NextApiResponse, product: ProductProps) {
    try {
        await prisma.product.update({
            where: {
                id: product.id
            },
            data: {
                name: product.name,
                category: product.category,
                color: product.color,
                description: product.desc,
                price: product.price,
                listImage: product.image,
                size: product.size,
                gender: product.gender
            }
        })
        res.status(200).json('Update Successful')
    } catch (error) {
        res.status(500).json(error)
    }
}

async function deleteProduct(res: NextApiResponse, id: string) {
    try {
        await prisma.product.delete({
            where: {
                id: id
            }
        })
        res.status(200).json('Update Successful')
    } catch (error) {
        res.status(500).json(error)
    }
}