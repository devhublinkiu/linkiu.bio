import { useState, useEffect } from 'react';

export interface Department {
    id: number;
    name: string;
    description: string;
    cityCapitalId: number;
    municipalities: number;
    surface: number;
    population: number;
    phonePrefix: string;
    countryId: number;
    cities: null;
    regionId: number;
}

export interface City {
    id: number;
    name: string;
    description: string;
    surface: number;
    population: number;
    postalCode: string;
    departmentId: number;
}

export function useColombiaApi() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoadingDepts(true);
        try {
            const response = await fetch('https://api-colombia.com/api/v1/Department');
            const data = await response.json();
            // Sort alphabetically
            setDepartments(data.sort((a: Department, b: Department) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoadingDepts(false);
        }
    };

    const fetchCities = async (departmentId: number) => {
        if (!departmentId) {
            setCities([]);
            return;
        }
        setLoadingCities(true);
        try {
            const response = await fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`);
            const data = await response.json();
            setCities(data.sort((a: City, b: City) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoadingCities(false);
        }
    };

    return {
        departments,
        cities,
        loadingDepts,
        loadingCities,
        fetchCities
    };
}
