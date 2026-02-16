import { Person } from '@/constants/Types';
import { persons as mockPersons } from '@/constants/MockData';
import { getPersons } from '@/lib/persons';
import { useCallback, useEffect, useState } from 'react';

export function usePersons(): Person[] {
    const [persons, setPersons] = useState<Person[]>([]);

    const load = useCallback(async () => {
        try {
            const list = await getPersons();
            setPersons(list);
        } catch (_) {
            setPersons([]);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return persons.length > 0 ? persons : mockPersons;
}
