import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useServerOwner = () => {
  const { serverId } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const servers = useSelector((state) => state.servers);

  const server = servers.find(
    (server) => Number(server.id) === Number(serverId)
  );

  return server ? currentUser?.id === server.user_id : false;
};

export default useServerOwner;
