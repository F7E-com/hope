<Routes>
  <Route path="/" element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="new-user" element={<NewUser />} />
    <Route path="profile/:uid" element={<Profile />} />
    <Route path="creator/:uid" element={<CreatorPage />} />
    <Route path="events" element={<Events />} />
    <Route path="search" element={<Search />} />

    {/* Content routes */}
    <Route path="watch" element={<Watch />} />
    <Route path="listen" element={<Listen />} />
    <Route path="read" element={<Read />} />
    <Route path="play" element={<Play />} />
    <Route path="content/:id" element={<ContentPage />} />
  </Route>

  {/* fallback 404 */}
  <Route path="*" element={<h2>404 - Page Not Found</h2>} />
</Routes>
