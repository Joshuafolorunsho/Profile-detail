import React, { useEffect, useState } from 'react';
import './App.scss';

interface Profile {
    FirstName: string;
    LastName: string;
    UserName: string;
    Gender: string;
    Email: string;
    PhoneNumber: string;
    DomainName: string;
    PaymentMethod: string;
}

const App = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [profilesData, setProfilesData] = useState<Profile[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [gender, setGender] = useState('gender');
    const [paymentMethod, setPaymentMethod] = useState('paymentmethod');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [profilesPerPage] = useState(20);
    const [mode, setMode] = useState('dark-mode');

    const fetchData = async () => {
        try {
            const URL = 'https://api.enye.tech/v1/challenge/records';
            const request = await fetch(URL);
            const data = await request.json();
            setLoading(false);
            setProfiles(data.records.profiles);
            setProfilesData(data.records.profiles);
        } catch (err) {
            console.log('An error occured');
        }
    };

    const handleInputOnChange = (e: React.FormEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value;
        setInputValue(currentValue);
    };

    const handleGenderOnChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const genderType = e.currentTarget.value;
        setGender(genderType);

        if (paymentMethod !== 'paymentmethod') {
            const filteredByPaymentMethod = profilesData.filter(
                ({ Gender, PaymentMethod }) => Gender === genderType && PaymentMethod === paymentMethod,
            );
            setProfiles(filteredByPaymentMethod);
            return;
        }
        const filteredByGender = profilesData.filter(({ Gender }) => Gender === genderType);
        setProfiles(filteredByGender);
    };

    const handlePMOnChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const paymentMethodType = e.currentTarget.value;
        setPaymentMethod(paymentMethodType);

        if (gender !== 'gender') {
            const filteredByPaymentMethod = profilesData.filter(
                ({ Gender, PaymentMethod }) => Gender === gender && PaymentMethod === paymentMethodType,
            );
            setProfiles(filteredByPaymentMethod);
            return;
        }
        const filteredByPaymentMethod = profilesData.filter(({ PaymentMethod }) => PaymentMethod === paymentMethodType);
        setProfiles(filteredByPaymentMethod);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Get current posts
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentPosts = profiles.slice(indexOfFirstProfile, indexOfLastProfile);

    const displayPagination = (profilesPerPage: number, totalProfiles: number) => {
        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(totalProfiles / profilesPerPage); i++) {
            pageNumbers.push(i);
        }

        return pageNumbers.map((number) => {
            const active = currentPage === number ? 'active' : '';
            return (
                <>
                    <li>
                        <button className={active} onClick={() => setCurrentPage(number)}>
                            {number}
                        </button>
                    </li>
                </>
            );
        });
    };

    const handleClickMode = () => {
        setMode((prevMode) => {
            if (prevMode === 'light-mode') {
                return 'dark-mode';
            }
            return 'light-mode';
        });
    };

    const activeMode = 'light-mode' === mode ? '#999999' : 'white';

    let showProfileDetail = `Showing 1 - 20 out ${profiles.length}`;

    if (profiles.length < 20) {
        showProfileDetail = `Showing 1 - ${profiles.length}`;
    }

    return (
        <div className={mode}>
            <div className="wrapper">
                <div className="top-nav">
                    <h1>ProfileDetails</h1>
                    <button onClick={handleClickMode}>
                        <svg
                            fill={activeMode}
                            height="25px"
                            width="25px"
                            viewBox="-12 0 448 448.04455"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m224.023438 448.03125c85.714843.902344 164.011718-48.488281 200.117187-126.230469-22.722656 9.914063-47.332031 14.769531-72.117187 14.230469-97.15625-.109375-175.890626-78.84375-176-176 .972656-65.71875 37.234374-125.832031 94.910156-157.351562-15.554688-1.980469-31.230469-2.867188-46.910156-2.648438-123.714844 0-224.0000005 100.289062-224.0000005 224 0 123.714844 100.2851565 224 224.0000005 224zm0 0" />
                        </svg>
                    </button>
                </div>
                <header>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={inputValue}
                            onChange={handleInputOnChange}
                        />
                    </div>
                    <div className="filter">
                        <p>Filter by</p>
                        <div className="select-dropdown">
                            <select defaultValue={gender} onChange={handleGenderOnChange}>
                                <option value="gender" disabled>
                                    Gender
                                </option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer to skip">Anonymous</option>
                            </select>
                        </div>
                        <div className="select-dropdown">
                            <select defaultValue={paymentMethod} onChange={handlePMOnChange}>
                                <option value="paymentmethod" disabled>
                                    Payment method
                                </option>
                                <option value="cc">Credit Card</option>
                                <option value="paypal">Paypal</option>
                                <option value="money order">Money Order</option>
                                <option value="check">Check</option>
                            </select>
                        </div>
                    </div>
                </header>
                <main>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Domain Name</th>
                                <th>Payment Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading
                                ? 'loading...'
                                : currentPosts
                                      .filter(({ FirstName, LastName }) => {
                                          const name = `${FirstName} ${LastName}`.toLowerCase();
                                          return name.includes(inputValue.toLowerCase());
                                      })

                                      .map(
                                          (
                                              {
                                                  FirstName,
                                                  LastName,
                                                  UserName,
                                                  Gender,
                                                  Email,
                                                  PhoneNumber,
                                                  DomainName,
                                                  PaymentMethod,
                                              },
                                              index,
                                          ) => {
                                              return (
                                                  <tr key={UserName}>
                                                      <td>{index + 1}</td>
                                                      <td className="name">
                                                          {FirstName} {LastName}
                                                      </td>
                                                      <td>{Gender}</td>
                                                      <td>{UserName}</td>
                                                      <td>{Email}</td>
                                                      <td>{PhoneNumber}</td>
                                                      <td>{DomainName}</td>
                                                      <td>{PaymentMethod}</td>
                                                  </tr>
                                              );
                                          },
                                      )}
                        </tbody>
                    </table>
                </main>
                <footer>
                    <p>{showProfileDetail}</p>
                    <ul>{displayPagination(profilesPerPage, profiles.length)}</ul>
                </footer>
            </div>
        </div>
    );
};

export default App;
